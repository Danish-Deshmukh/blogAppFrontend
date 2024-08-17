import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const useErrors = () => {
  const navigation = useNavigation();
  const {logout, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const serverError = () => {
    Alert.alert(
      'Something went wrong',
      'Internal Server error problem status code 500',
      [
        {
          text: 'OK',
        },
      ],
    );
  };
  const pageNotFoundError = () => {
    Alert.alert(
      'Something went wrong!!!',
      'Post is not present in the database you need to restart the application to see the changes',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
        },
      ],
    );
  };
  const tockenExpire = () => {
    Alert.alert(
      'Token Expire',
      'You need to login again to preform this operation, Press "OK" to logout ',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            logout();
            navigation.navigate('Login');
          },
        },
      ],
    );
  };
  return {
    serverError,
    pageNotFoundError,
    tockenExpire,
  };
};

export default useErrors;

const styles = StyleSheet.create({});
