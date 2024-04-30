import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppLogo from '../components/common/AppLogo';
import {fontPath} from '../utils/fontPath';
import {hp, wp} from '../helper/responsiveScreen';
import {useFormik} from 'formik';
import {registerValidationSchema} from '../utils/authSchema';
import {imagePath} from '../utils/imagePath';
import TextInputFiled from '../components/common/TextInputFiled';
import {colors} from '../utils/colors';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/common/Button';
import ArrowRight from '../assets/svg/ArrowRight';
import {commonstyle} from '../utils/commonStyles';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RouteString, contant} from '../utils/appString';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {generateGPTResponse} from '../helper/AxoisService';
import {FocusAwareStatusBar} from '../components/common/StatusBar';
import Toast from 'react-native-toast-message';

interface RegisterFromType {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<any>>();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [newpasswordVisibility, setNewPasswordVisibility] = useState(true);
  const [showIcons, setShowIcons] = useState(imagePath.hide);
  const [rightIcon, setRightIcon] = useState(imagePath.hide);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {handleChange, handleBlur, handleSubmit, values, touched, errors} =
    useFormik<RegisterFromType>({
      initialValues: {email: '', password: '', confirmPassword: ''},
      validationSchema: registerValidationSchema,
      onSubmit: values => {
        register(values);
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

  const handlenewPasswordVisibility = () => {
    if (showIcons === imagePath.hide) {
      setShowIcons(imagePath.show);
      setNewPasswordVisibility(!newpasswordVisibility);
    } else if (showIcons === imagePath.show) {
      setShowIcons(imagePath.hide);
      setNewPasswordVisibility(!newpasswordVisibility);
    }
  };

  const register = async (values: any) => {
    setIsLoading(true);
    if (
      values.email &&
      values.password &&
      values.confirmPassword &&
      toggleCheckBox
    ) {
      await auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then(async (res: any) => {
          await AsyncStorage.setItem('USERDATA', JSON.stringify(res?.user));
          await generateGPTResponse('system', contant);
          await firestore()
            .collection('Users')
            .doc(res?.user?.uid)
            .set({
              userId: res?.user?.uid,
              messages: [
                {
                  _id: uuid.v4(),
                  text: 'Hi, I am your Folk Computing Health assistant. I am here to help you with your health-related questions.',
                  createdAt: new Date(),
                  user: {
                    _id: 'AI-Chat',
                  },
                },
              ],
            });
          navigation.reset({
            index: 0,
            routes: [{name: RouteString.ChatScreen}],
          });
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            Toast.show({text1: 'email address is already in use!'});
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Toast.show({text1: 'email address is invalid!'});
          }

          console.error(error);
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
        <Text style={commonstyle.title}>register</Text>
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
        <TextInputFiled
          placeholder="Confirm Password"
          type="password"
          value={values.confirmPassword}
          onBlur={handleBlur('confirmPassword')}
          onChangeText={handleChange('confirmPassword')}
          source={showIcons}
          onPress={handlenewPasswordVisibility}
          secureTextEntry={newpasswordVisibility}
          style={styles.textinputView}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <Text style={commonstyle.error}>{errors.confirmPassword}</Text>
        )}
        <View style={styles.rowCheckBox}>
          <CheckBox
            value={toggleCheckBox}
            boxType="square"
            onCheckColor={colors.primary}
            onTintColor={colors.primary}
            style={commonstyle.checkbox}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          <Text style={styles.acceptText}>
            I accept the privacy policy and terms and conditions
          </Text>
        </View>
        <Button
          buttonName="register"
          width={wp(50)}
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonStyle={{alignSelf: 'center'}}
        />
      </KeyboardAvoidingView>
      <View style={commonstyle.rowBottom}>
        <Text style={commonstyle.loginText}>login existing user</Text>
        <TouchableOpacity
          style={commonstyle.rightArrow}
          onPress={() => navigation.navigate(RouteString.LoginScreen)}>
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

export default RegisterScreen;

const styles = StyleSheet.create({
  rowCheckBox: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: hp(5),
  },
  acceptText: {
    width: wp(50),
    alignSelf: 'center',
    fontFamily: fontPath.MontserratMedium,
    color: colors.black,
    fontSize: 13,
    marginLeft: wp(4),
  },
  textinputView: {
    marginTop: hp(2),
  },
});
