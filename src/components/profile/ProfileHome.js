import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Login from './Login';
import Profile from './Profile';
import {useStoreActions, useStoreState} from 'easy-peasy';

export default function ProfileHome({navigation}) {
  const isLogged = useStoreState((state) => state.isLogged);
  if (isLogged) {
    return <Profile />;
  }
  return <Login navigation={navigation} />;
}
