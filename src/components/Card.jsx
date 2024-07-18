import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext } from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function Card({item}) {
  const {REST_API_BASE_URL} = useContext(AuthContext);
  const navigation = useNavigation();
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
          <Text style={[styles.text, styles.titleText]} numberOfLines={4}>
            {item.title}
          </Text>
        </View>
        <View
          style={
            {
              // borderWidth: 1,
            }
          }>
          <Text style={[styles.text, styles.descText]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
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
          {item.image && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: moderateScale(2),
              }}
              source={{
                uri: `${REST_API_BASE_URL}/image/${item.image}`,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>

    // <Pressable
    //   onPress={() => {
    //     navigation.navigate('PostDetailScreen', item);
    //   }}
    //   style={{
    //     borderWidth: 0.5,
    //     margin: moderateScale(10),
    //     borderRadius: moderateScale(10),
    //     height: verticalScale(190),
    //     // elevation: 1,
    //     // padding: moderateScale(2)
    //   }}>
    //   {item.image && (
    //     <Image
    //       style={{
    //         width: '100%',
    //         height: '100%',
    //         borderRadius: moderateScale(10),
    //         opacity: 0.5,
    //       }}
    //       source={{
    //         uri: `${REST_API_BASE_URL}/image/${item.image}`,
    //       }}
    //     />
    //   )}
    //   <View
    //     style={{
    //       //   borderWidth: 1,
    //       position: 'absolute',
    //       paddingHorizontal: moderateScale(10),
    //       bottom: verticalScale(50),
    //       left: moderateScale(10),
    //     }}>
    //     {/* <Text style={[styles.text, styles.titleText]} numberOfLines={1}>
    //       {item.id}
    //     </Text> */}
    //     <Text style={[styles.text, styles.titleText]} numberOfLines={1}>
    //       {item.title}
    //     </Text>
    //   </View>
    //   <View
    //     style={{
    //       //   borderWidth: 1,
    //       position: 'absolute',
    //       bottom: verticalScale(15),
    //       left: moderateScale(10),
    //       paddingHorizontal: moderateScale(10),
    //     }}>
    //     <Text style={[styles.text, styles.descText]} numberOfLines={2}>
    //       {item.description}
    //     </Text>
    //   </View>
    // </Pressable>
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
    fontWeight: '700',
    // textTransform: 'capitalize',
  },
  descText: {
    fontSize: moderateScale(17),
    color: 'gray',
    // fontWeight: '500',
  },
});
