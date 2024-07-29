import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale} from 'react-native-size-matters';

const WhiteButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        borderWidth: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <Text
        style={{
          color: 'black',
          fontWeight: '700',
          fontSize: moderateScale(15),
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default WhiteButton;

const styles = StyleSheet.create({});
