import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [REST_API_BASE_URL, SetREST_API_BASE_URL] = useState('http://192.168.1.18:8080/api/v1');
  const [REST_API_BASE_URL, SetREST_API_BASE_URL] = useState('');

  useEffect(() => {
    isLoggedIn();
    findAdmin();
    getRESTapiURL();
  }, []);

  const getRESTapiURL = async () => {
    console.log('get URL called ');
    let url = await AsyncStorage.getItem('BaseUrl');
    console.log(url);

    const newUrl = url + '/api/v1';
    SetREST_API_BASE_URL(newUrl);

    console.log(newUrl);
  };

  const findAdmin = async () => {
    console.log('finadmin calded');
    let userInfooo = await AsyncStorage.getItem('userInfo');
    if (userInfooo) {
      userInfooo = JSON.parse(userInfooo);
      const role = userInfooo.role[0].id;
      if (role === 2) {
        setIsAdmin(true);
      }
    }
  };

  const getUrl = async () => {
    console.log('get URL called ');
    let url = await AsyncStorage.getItem('BaseUrl');
    console.log(url);
    return url;
  };

  const register = (name, username, email, password) => {
    setIsLoading(true);

    axios
      .post(`${REST_API_BASE_URL}/auth/register`, {
        name,
        username,
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (usernameOrEmail, password) => {
    setIsLoading(true);

    axios
      .post(`${REST_API_BASE_URL}/auth/login`, {
        usernameOrEmail,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        console.log(userInfo);
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        findAdmin();
      })
      .catch(e => {
        console.log(`login error ${e}`);
        setIsLoading(false);
        return e;
      });
  };

  const logout = async () => {
    setIsLoading(true);
    AsyncStorage.removeItem('userInfo');
    setUserInfo({});
    setIsAdmin(false);
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);

      console.log(`is logged in error ${e}`);
    }
  };

  /// ERRORs that may accure
  const tockenExpireErr = () => {
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
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
        isAdmin,
        tockenExpireErr,
        REST_API_BASE_URL,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
