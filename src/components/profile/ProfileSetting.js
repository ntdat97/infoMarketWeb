import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '../firebase/config';
export default function ProfileSetting({navigation}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(() => navigation.popToTop());
        }}
        style={{}}>
        <Icon name="logout" size={30} />
      </TouchableOpacity>
    </View>
  );
}
