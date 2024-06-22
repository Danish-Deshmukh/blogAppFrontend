import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {BottomTab} from '../Navigation';
import { moderateScale } from 'react-native-size-matters';

export default function SplashScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('BottomTab');
    }, 2000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }}>
      <Text style={{
        fontSize: moderateScale(25),
        fontWeight: '700',
        color: 'black'
      }}>Blog Application</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
