import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../helper/responsiveScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fontPath} from '../utils/fontPath';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/common/Button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RouteString, contant} from '../utils/appString';
import AppLogo from '../components/common/AppLogo';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {FocusAwareStatusBar} from '../components/common/StatusBar';
import {generateGPTResponse} from '../helper/AxoisService';

const OnBoradingScreen = () => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<any>>();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const next = async () => {
    if (toggleCheckBox) {
      const userData = await AsyncStorage.getItem('USERDATA');
      if (userData) {
        await generateGPTResponse('system', contant);
        navigation.navigate(RouteString.ChatScreen);
      } else {
        navigation.navigate(RouteString.RegisterScreen);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please accept terms',
      });
    }
  };

  return (
    <View style={[styles.mainView, {paddingTop: top}]}>
      <AppLogo />
      <FocusAwareStatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <Text style={styles.importantText}>important!</Text>
      <Text style={styles.des}>
        The folk computing app provides health suggestions but does not replace
        professional medical advice. Consult a healthcare professional for
        personalised guidance. Accuracy may vary, and the app is still in
        development. Use at your own discretion.
      </Text>
      <View style={styles.row}>
        <CheckBox
          value={toggleCheckBox}
          boxType="square"
          onCheckColor={colors.primary}
          onTintColor={colors.primary}
          style={styles.checkbox}
          onValueChange={newValue => setToggleCheckBox(newValue)}
          tintColors={{true: colors.primary, false: colors.primary}}
        />
        <Text style={styles.understandText}>I understand</Text>
      </View>
      <Button
        buttonName="continue"
        width={wp(90)}
        buttonStyle={styles.button}
        onPress={() => next()}
      />
    </View>
  );
};

export default OnBoradingScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  importantText: {
    fontFamily: fontPath.MontserratExtraBold,
    fontSize: 30,
    color: colors.black,
    textTransform: 'uppercase',
    marginTop: hp(8),
  },
  des: {
    fontFamily: fontPath.MontserratMedium,
    fontSize: 20,
    textAlign: 'center',
    color: colors.light_black,
    marginHorizontal: wp(13),
    marginTop: hp(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(9),
    columnGap: wp(2),
  },
  understandText: {
    fontFamily: fontPath.MontserratMedium,
    fontSize: 17,
    color: colors.light_black,
    alignSelf: 'center',
    marginLeft: wp(3),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
  },
  button: {
    position: 'absolute',
    bottom: hp(3),
  },
});
