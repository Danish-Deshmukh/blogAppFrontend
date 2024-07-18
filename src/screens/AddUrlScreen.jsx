import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {moderateScale} from 'react-native-size-matters';

export default function AddUrlScreen() {
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  const client = useQueryClient();

  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };
  const savingUrl = async () => {
    console.log(url);
    AsyncStorage.setItem('BaseUrl', url);
    Refresh();
    navigation.navigate('Home');
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}>
      <Text
        style={{
          color: 'green',
          marginBottom: 10,
          fontSize: moderateScale(15),
          fontWeight: '500',
        }}>
        After Saving the URL Restart the Application
      </Text>
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

      <Button title={'save'} onPress={savingUrl} />
    </View>
  );
}
