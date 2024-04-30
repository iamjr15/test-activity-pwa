/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {commonstyle} from '../utils/commonStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {imagePath} from '../utils/imagePath';
import {hp, wp} from '../helper/responsiveScreen';
import SendIcons from '../assets/svg/SendIcons';
import {
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {colors} from '../utils/colors';
import {
  generateTextFromSpeech,
  generateGPTResponse,
  getVoiceFileFromText,
} from '../helper/AxoisService';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {fontPath} from '../utils/fontPath';
import LogoutIcons from '../assets/svg/LogoutIcons';
import ArrowUp from '../assets/svg/ArrowUp';
import auth from '@react-native-firebase/auth';
import {RouteString, laungCode} from '../utils/appString';
import {FocusAwareStatusBar} from '../components/common/StatusBar';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import storage from '@react-native-firebase/storage';

const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatScreen = () => {
  const {top} = useSafeAreaInsets();
  const [messages, setMessages] = useState<any>([]);
  const [userData, setUserData] = useState<any>();
  const [firebseDoc, setFirebaseDoc] = useState<any>();
  const isFoused = useIsFocused();
  const [isTyping, setIsTyping] = useState(false);
  const [startVoice, setStartVoice] = useState(true);
  const [laungCodeName, setLaungCodeName] = useState(laungCode[0]);
  const [recoderPath, setRecorderPath] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isVoiceConverting, setIsVoiceConverting] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    if (isFoused) {
      initializeUserDoc();
    }
  }, [isFoused]);

  const initializeUserDoc = async () => {
    const json: any = await AsyncStorage.getItem('USERDATA');
    setUserData(JSON.parse(json));
    firestore()
      .collection('Users')
      .doc(JSON.parse(json)?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setFirebaseDoc(documentSnapshot.data());
          const newMessage = documentSnapshot
            .data()
            ?.messages?.map((item: any) => ({
              ...item,
              createdAt: item?.createdAt?.toDate(),
            }));
          setMessages(newMessage);
        }
      });
  };

  const onSend = useCallback(
    async (_messages: Partial<IMessage>[] = []) => {
      const newArray = [...firebseDoc?.messages];
      if (_messages[0]?.text) {
        newArray.unshift({
          _id: uuid.v4(),
          text: _messages[0]?.text,
          createdAt: new Date(),
          user: {
            _id: userData?.uid,
          },
        });
        await firestore()
          .collection('Users')
          .doc(userData?.uid)
          .update({messages: newArray})
          .then(async () => {
            setIsTyping(true);
            const res = await generateGPTResponse('user', _messages[0]?.text);
            if (res.success) {
              const voiceFileOfGptResponse = await getVoiceFileFromText(
                res?.msg?.content,
                laungCodeName.code,
              );
              newArray.unshift({
                _id: uuid.v4(),
                text: res?.msg?.content,
                createdAt: new Date(),
                user: {
                  _id: 'AI-Chat',
                },
              });
              await firestore()
                .collection('Users')
                .doc(userData?.uid)
                .set({messages: newArray});
              setIsTyping(false);

              if (voiceFileOfGptResponse) {
                audioRecorderPlayer.startPlayer(
                  'file://' + voiceFileOfGptResponse,
                );
              }
            }
          });
      }
    },
    [firebseDoc, userData, laungCodeName],
  );

  const getVoiceRecordingPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const onStartRecord = useCallback(async () => {
    await getVoiceRecordingPermissions();
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(() => {});
    setRecorderPath(result);
  }, []);

  const onStopRecord = useCallback(async () => {
    setIsVoiceConverting(true);
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    const reference = await storage()
      .ref(`/${userData?.uid}.mp3`)
      .putFile(recoderPath);

    const googleStorageUri = `gs://${reference.metadata.bucket}/${reference.metadata.fullPath}`;

    if (reference) {
      const reponse = await generateTextFromSpeech(
        googleStorageUri,
        laungCodeName?.code,
      );

      setIsVoiceConverting(false);
      if (reponse?.success) {
        onSend([{text: reponse?.msg}]);
      } else {
        console.log('reponse', reponse?.msg);
      }
    }
  }, [laungCodeName, recoderPath, userData, onSend]);

  const Input = useCallback(
    (props: any) => {
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.InputContainer}
          renderComposer={composerProps => (
            <View style={styles.inputRowView}>
              {isVoiceConverting ? (
                <ActivityIndicator
                  size="large"
                  color={'black'}
                  style={{marginRight: wp(1.5)}}
                />
              ) : startVoice ? (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    onStartRecord();
                    setStartVoice(false);
                  }}>
                  <Image
                    source={imagePath.Microphone}
                    style={styles.microPhoneIcons}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    onStopRecord();
                    setStartVoice(true);
                  }}>
                  <Image
                    source={imagePath.Microphone}
                    style={[
                      styles.microPhoneIcons,
                      {tintColor: colors.primary},
                    ]}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.composerContainer}>
                <Composer
                  {...composerProps}
                  placeholder="type"
                  textInputStyle={{
                    paddingTop: hp(1.5),
                    color: 'black',
                    paddingRight: wp(12),
                  }}
                />
              </View>
            </View>
          )}
          renderSend={() => {
            return (
              <Send
                disabled={isVoiceConverting || isTyping}
                {...props}
                alwaysShowSend
                containerStyle={styles.sendIconsView}>
                <View style={styles.sendIcons}>
                  <SendIcons />
                </View>
              </Send>
            );
          }}
        />
      );
    },
    [onStartRecord, onStopRecord, startVoice, isTyping, isVoiceConverting],
  );

  const logout = async () => {
    await auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: RouteString.LoginScreen}],
        });
      });
  };

  return (
    <View style={[commonstyle.mainView, {paddingTop: top}]}>
      <FocusAwareStatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => setIsDropDownOpen(!isDropDownOpen)}>
          <Text style={styles.langText}>{laungCodeName?.name}</Text>
          <ArrowUp />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <LogoutIcons />
        </TouchableOpacity>
      </View>
      {isDropDownOpen && (
        <View style={[styles.dropDownView, {top: top + hp(6.5)}]}>
          {laungCode?.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => setLaungCodeName(item)}>
              <Text style={styles.laungNameText}>{item?.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <GiftedChat
        messages={messages}
        messagesContainerStyle={{paddingBottom: hp(5)}}
        renderInputToolbar={Input}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        renderAvatar={res => (
          <View
            style={[
              styles.redDot,
              {
                backgroundColor: res?.nextMessage?._id
                  ? 'transparent'
                  : colors.primary,
              },
            ]}
          />
        )}
        isTyping={isTyping}
        renderBubble={props => {
          const isSameUserMessage =
            props.currentMessage?.user?._id === userData?.uid;
          return (
            <View
              style={[
                styles.messageView,
                {
                  backgroundColor: isSameUserMessage
                    ? colors.light_blue
                    : colors.light_yellow,
                  borderEndStartRadius: isSameUserMessage ? 0 : 12,
                  borderBottomRightRadius: isSameUserMessage ? 12 : 0,
                },
              ]}>
              {!isSameUserMessage && (
                <Text style={styles.assistantText}>assistant</Text>
              )}
              <Text style={styles.message}>{props.currentMessage?.text}</Text>
            </View>
          );
        }}
        onSend={_messages => onSend(_messages)}
        user={{
          _id: userData?.uid,
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  InputContainer: {
    height: hp(5),
    marginHorizontal: wp(5),
    bottom: hp(4),
    borderTopWidth: 0,
    borderRadius: 8,
  },
  sendIcons: {
    marginRight: wp(2),
  },
  inputRowView: {
    flexDirection: 'row',
    flex: 1,
  },
  microPhoneIcons: {
    width: wp(10),
    height: wp(10),
    alignSelf: 'center',
  },
  sendIconsView: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  langButton: {
    backgroundColor: colors.light_white_1,
    paddingVertical: hp(1),
    marginRight: wp(2),
    paddingHorizontal: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  langText: {
    fontFamily: fontPath.PoppinsSemiBold,
    color: colors.black,
    width: wp(65),
    textAlign: 'center',
  },
  logoutButton: {
    paddingHorizontal: wp(4),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    borderRadius: 12,
  },
  message: {
    fontFamily: fontPath.MontserratMedium,
    fontSize: 15,
    color: colors.black,
  },
  assistantText: {
    fontFamily: fontPath.PoppinsMedium,
    color: colors.black,
  },
  laungNameText: {
    fontFamily: fontPath.MontserratSemiBold,
    fontSize: 16,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  dropDownView: {
    backgroundColor: colors.light_white_1,
    position: 'absolute',
    width: wp(90),
    zIndex: 1,
    marginTop: hp(1),
    marginHorizontal: wp(5),
  },
  messageView: {
    maxWidth: wp(80),
    padding: wp(2),
    borderTopLeftRadius: 12,
    borderStartEndRadius: 12,
  },
  redDot: {
    width: wp(5),
    height: wp(5),
    borderRadius: 20,
  },
  composerContainer: {
    backgroundColor: colors.light_white_1,
    flex: 1,
    height: hp(6),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light_gray_1,
  },
});
