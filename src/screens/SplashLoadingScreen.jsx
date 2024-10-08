import {ActivityIndicator, View} from 'react-native';
import React from 'react';

const SplashLoadingScreen = () => {
  return (
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#06bcee'}}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default SplashLoadingScreen;
