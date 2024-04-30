import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoradingScreen from '../screen/OnBoradingScreen';
import {RouteString} from '../utils/appString';
import RegisterScreen from '../screen/RegisterScreen';
import LoginScreen from '../screen/LoginScreen';
import ChatScreen from '../screen/ChatScreen';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={RouteString.OnBoradingScreen}>
        <Stack.Screen
          name={RouteString.OnBoradingScreen}
          component={OnBoradingScreen}
        />
        <Stack.Screen
          name={RouteString.RegisterScreen}
          component={RegisterScreen}
        />
        <Stack.Screen name={RouteString.LoginScreen} component={LoginScreen} />
        <Stack.Screen name={RouteString.ChatScreen} component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
