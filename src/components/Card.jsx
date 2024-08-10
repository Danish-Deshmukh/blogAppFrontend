import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export default function Card({item}) {
  const {REST_API_BASE_URL} = useContext(AuthContext);
  const navigation = useNavigation();

  const [coverImage, setCoverIamge] = useState();

  useEffect(() => {
    imageSetter();
  }, [item]);
  const imageSetter = () => {
    const url = item?.coverImage;
    if (url === undefined || url === null || url === '') {
      return;
    }
    if (url.startsWith('https://')) {
      setCoverIamge(item.coverImage);
    } else {
      setCoverIamge(`${REST_API_BASE_URL}/image/${item.coverImage}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PostDetailScreen', item);
      }}
      style={{
        margin: moderateScale(5),
        borderRadius: moderateScale(5),
        height: verticalScale(160),
        elevation: 2,
        // borderWidth: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
      }}>
      {/* Title and desc container */}
      <View
        style={{
          // borderWidth: 1,
          width: '70%',
          padding: moderateScale(5),
          paddingHorizontal: moderateScale(15),
          justifyContent: 'center',
        }}>
        <View
          style={
            {
              // borderWidth: 1,
            }
          }>
          {/* <Text style={[styles.text, styles.titleText]} numberOfLines={1}>
            {item.id}
          </Text> */}
          <Text style={[styles.text, styles.titleText]} numberOfLines={3}>
            {item.title}
          </Text>
        </View>
        <View
          style={
            {
              // borderWidth: 1,
            }
          }>
          <Text style={[styles.text, styles.descText]} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </View>

      {/* Image container */}
      <View
        style={{
          // borderWidth: 1,
          width: '30%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            // borderWidth: 1,
            height: '30%',
            width: '90%',
          }}>
          {coverImage && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: moderateScale(2),
              }}
              source={{uri: coverImage}}
            />
          )}
        </View>
      </View>

      {/* Comment and Bookmark button container  */}
      <View></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    textShadowColor: 'white',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
  },
  titleText: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    // textTransform: 'capitalize',
  },
  descText: {
    fontSize: moderateScale(17),
    color: 'gray',
    // fontWeight: '500',
  },
});
