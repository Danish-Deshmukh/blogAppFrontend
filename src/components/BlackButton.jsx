import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale} from 'react-native-size-matters';

const BlackButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        backgroundColor: 'black',
        height: '100%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <Text
        style={{
          color: 'white',
          fontWeight: '700',
          fontSize: moderateScale(15),
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BlackButton;

const styles = StyleSheet.create({});
