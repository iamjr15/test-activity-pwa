import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {commonstyle} from '../utils/commonStyles';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppLogo from '../components/common/AppLogo';
import {useFormik} from 'formik';
import {loginValidationSchema} from '../utils/authSchema';
import TextInputFiled from '../components/common/TextInputFiled';
import {imagePath} from '../utils/imagePath';
import {hp, wp} from '../helper/responsiveScreen';
import Button from '../components/common/Button';
import ArrowRight from '../assets/svg/ArrowRight';
import {RouteString, contant} from '../utils/appString';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateGPTResponse} from '../helper/AxoisService';
import {FocusAwareStatusBar} from '../components/common/StatusBar';
import Toast from 'react-native-toast-message';

interface RegisterFromType {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<any>>();
  const [rightIcon, setRightIcon] = useState(imagePath.hide);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {handleChange, handleBlur, handleSubmit, values, touched, errors} =
    useFormik<RegisterFromType>({
      initialValues: {email: '', password: ''},
      validationSchema: loginValidationSchema,
      onSubmit: values => {
        login(values);
      },
    });

  const handlePasswordVisibility = () => {
    if (rightIcon === imagePath.hide) {
      setRightIcon(imagePath.show);
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === imagePath.show) {
      setRightIcon(imagePath.hide);
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const login = async (values: any) => {
    setIsLoading(true);
    if (values.email && values.password) {
      await auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(async (res: any) => {
          await AsyncStorage.setItem('USERDATA', JSON.stringify(res?.user));
          await generateGPTResponse('system', contant);
          navigation.reset({
            index: 0,
            routes: [{name: RouteString.ChatScreen}],
          });
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          if (error.code === 'auth/invalid-credential') {
            console.log('Incorrect Email/Password');
            Toast.show({text1: 'Incorrect Email/Password'});
          }
        });
    }
  };

  return (
    <View style={[commonstyle.mainView, {paddingTop: top}]}>
      <FocusAwareStatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <KeyboardAvoidingView behavior="position">
        <AppLogo />
        <Text style={commonstyle.title}>login</Text>
        <TextInputFiled
          placeholder="email"
          value={values.email}
          onBlur={handleBlur('email')}
          onChangeText={handleChange('email')}
        />
        {touched.email && errors.email && (
          <Text style={commonstyle.error}>{errors.email}</Text>
        )}
        <TextInputFiled
          placeholder="Password"
          type="password"
          value={values.password}
          onBlur={handleBlur('password')}
          onChangeText={handleChange('password')}
          source={rightIcon}
          onPress={handlePasswordVisibility}
          secureTextEntry={passwordVisibility}
          style={styles.textinputView}
        />
        {touched.password && errors.password && (
          <Text style={commonstyle.error}>{errors.password}</Text>
        )}
        <Button
          buttonName="login"
          width={wp(50)}
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonStyle={styles.loginButton}
        />
      </KeyboardAvoidingView>
      <View style={commonstyle.rowBottom}>
        <Text style={commonstyle.loginText}>register new account</Text>
        <TouchableOpacity
          style={commonstyle.rightArrow}
          onPress={() => navigation.navigate(RouteString.RegisterScreen)}>
          <ArrowRight />
        </TouchableOpacity>
      </View>
      <View style={commonstyle.bottomRowText}>
        <Text style={commonstyle.termText}>privacy policy</Text>
        <Text style={commonstyle.termText}>terms and conditions</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  textinputView: {
    marginTop: hp(2),
  },
  loginButton: {
    alignSelf: 'center',
    marginTop: hp(5),
  },
});
