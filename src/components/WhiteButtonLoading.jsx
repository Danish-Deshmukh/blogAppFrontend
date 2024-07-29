import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const WhiteButtonLoading = () => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <ActivityIndicator color={'black'} />
    </TouchableOpacity>
  );
};

export default WhiteButtonLoading;

const styles = StyleSheet.create({});
