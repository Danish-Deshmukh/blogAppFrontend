import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const BlackButtonLoading = () => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        backgroundColor: 'black',
        height: '100%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <ActivityIndicator color={'white'} />
    </TouchableOpacity>
  );
};

export default BlackButtonLoading;

const styles = StyleSheet.create({});
