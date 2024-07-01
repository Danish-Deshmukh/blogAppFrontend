import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddUrlScreen() {
  const [url, setUrl] = useState('');

  const savingUrl = async () => {
    console.log(url);
    AsyncStorage.setItem('BaseUrl', url);
  };
  const getUrl = async () => {
    let url = await AsyncStorage.getItem('BaseUrl');
    setUrl(url);
    console.log(url);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}>
      <TextInput
        placeholder="Enter Url here"
        value={url}
        onChangeText={text => setUrl(text)}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          width: '100%',
        }}
      />
      <Text>{url}</Text>
      <Button title={'save'} onPress={savingUrl} />
      <Button title={'get'} onPress={getUrl} />
    </View>
  );
}
