import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Bookmark = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Ionicons name={'construct'} size={110} color={'black'} />
      <Text>This page is Under Construction</Text>
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
