import axios, {AxiosHeaders} from 'axios';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

const chatGPTURL = 'https://api.openai.com/v1/chat/completions';
const chatGTPAPIKey = 'API KEY';
const chatgptModel = 'gpt-3.5-turbo';
const jwtCloudFunctionURL = 'https://getjwttoken-fkt6vl2lgq-uc.a.run.app';
const googlecloudAccessTokenURL = 'https://oauth2.googleapis.com/token';
const speechToTextURL = 'https://speech.googleapis.com/v1/speech:recognize';
const textToSpeechURL =
  'https://texttospeech.googleapis.com/v1/text:synthesize';

let expiryTime = Date.now();
let accessToken: string | null = null;

const gptAxiosClient = axios.create({
  headers: {
    Authorization: 'Bearer ' + chatGTPAPIKey,
    'Content-Type': 'application/json',
  },
});

const serviceUnavailableError = () => {
  Alert.alert(
    'Service Unavailable',
    'Our Services are down at the moment! Please try again after sometime',
  );
};

export const generateGPTResponse = async (role: any, prompt: any) => {
  try {
    const res = await gptAxiosClient.post(chatGPTURL, {
      model: chatgptModel,
      messages: [{role, content: prompt}],
    });
    return {
      success: true,
      msg: res?.data?.choices[0]?.message,
    };
  } catch (err: any) {
    serviceUnavailableError();
    return {success: false, msg: err.message};
  }
};

const getServiceAccountJWTToken = async () => {
  try {
    if (Date.now() < expiryTime) {
      console.log('Cached Access Token is used');
      return accessToken;
    }

    console.log('New Access Token is generated');
    const response = await axios.get(jwtCloudFunctionURL);

    if (response.data?.token) {
      expiryTime = Date.now() + 3480000;
      accessToken = response.data?.token;
    }

    return response.data?.token || null;
  } catch (error) {
    serviceUnavailableError();
    console.log('getGoogleJWTToken error', error);
  }
};

const getGCPAccessToken = async (jwtToken: string) => {
  try {
    const headers = new AxiosHeaders();
    headers.setContentType('application/x-www-form-urlencoded');
    const response = await axios.post(
      googlecloudAccessTokenURL,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken,
      },
      {headers},
    );
    return (response?.data?.access_token as string) || null;
  } catch (error) {
    serviceUnavailableError();
    console.log('getGCPAccessToken error', error);
  }
};

export const generateTextFromSpeech = async (
  uri: string,
  languageCode: string,
) => {
  const jwtToken = await getServiceAccountJWTToken();
  if (!jwtToken) {
    serviceUnavailableError();
    return;
  }

  const gcpAccessToken = await getGCPAccessToken(jwtToken);
  if (!gcpAccessToken) {
    serviceUnavailableError();
    return;
  }

  const params = {
    config: {
      encoding: 'mp3',
      sampleRateHertz: 16000,
      languageCode: languageCode,
      enableWordTimeOffsets: false,
    },
    audio: {uri},
  };

  const headers = new AxiosHeaders();
  headers.setAuthorization(`Bearer ${gcpAccessToken}`);
  headers.setContentType('application/json');

  try {
    const res = await axios.post(speechToTextURL, params, {headers});
    return {
      success: true,
      msg: res?.data?.results[0]?.alternatives[0]?.transcript,
    };
  } catch (err: any) {
    serviceUnavailableError();
    return {success: false, msg: err};
  }
};

export const getVoiceFileFromText = async (
  text: string,
  languageCode: string,
) => {
  try {
    const jwtToken = await getServiceAccountJWTToken();
    if (!jwtToken) {
      serviceUnavailableError();
      return;
    }

    const gcpAccessToken = await getGCPAccessToken(jwtToken);
    if (!gcpAccessToken) {
      serviceUnavailableError();
      return;
    }

    const headers = new AxiosHeaders();
    headers.setAuthorization(`Bearer ${gcpAccessToken}`);
    headers.setContentType('application/json');

    const params = {
      input: {
        text: text,
      },
      voice: {
        languageCode: languageCode,
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const response = await axios.post(textToSpeechURL, params, {headers});
    const audioContent = response.data?.audioContent || null;

    if (!audioContent) {
      return null;
    }

    const localSaveFileURL = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.mp3`;
    await RNFS.writeFile(localSaveFileURL, audioContent, 'base64');

    return localSaveFileURL;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    serviceUnavailableError();
    return null;
  }
};
