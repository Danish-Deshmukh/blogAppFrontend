import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

export default function Card({item}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PostDetailScreen', item);
      }}
      style={{
        // borderWidth: 0.3,
        margin: moderateScale(10),
        borderRadius: moderateScale(10),
        height: verticalScale(190),
        elevation: 3,
        // padding: moderateScale(2)
      }}>
      {/* <Image source={require('../assets/images/background.jpeg')}
      style={{
        position: 'absolute',
        borderRadius: moderateScale(10),
        height: '100%',
        width: '100%'
      }} /> */}
      <View
        style={{
          //   borderWidth: 1,
          position: 'absolute',
          paddingHorizontal: moderateScale(10),
          bottom: verticalScale(50),
          left: moderateScale(10),
        }}>
        <Text style={[styles.text, styles.titleText]} numberOfLines={1}>
          {item.id}
        </Text>
        <Text style={[styles.text, styles.titleText]} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
      <View
        style={{
          //   borderWidth: 1,
          position: 'absolute',
          bottom: verticalScale(15),
          left: moderateScale(10),
          paddingHorizontal: moderateScale(10),
        }}>
        <Text style={[styles.text, styles.descText]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: '500',
  },
  descText: {
    fontSize: moderateScale(14),
    fontWeight: '300',
  },
});
