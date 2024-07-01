import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Profile() {
  const {userInfo, isLoading, logout, isAdmin} = useContext(AuthContext);

  const [name, setName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setName(userInfo.name);
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, []);

  const resetData = () => {
    setName('');
    setEmail('');
    setUserName('');
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert('LOGOUT', 'Are you sure you want to logout', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                logout();
                resetData();
              },
            },
          ]);
        }}
        style={{
          position: 'absolute',
          zIndex: 1,
          right: 10,
          top: 10,
          backgroundColor: 'white',
          borderWidth: 0.4,
          padding: moderateScale(10),
          borderRadius: moderateScale(10),
        }}>
        <Text style={{color: 'black'}}>Logout</Text>
      </TouchableOpacity>

      {/* EDIT PROFILE */}
      <Pressable
        onPress={() => {
          navigation.navigate('EditeProfile');
        }}
        style={{
          position: 'absolute',
          zIndex: 1,
          right: 10,
          bottom: 10,
          backgroundColor: '#2eb82e',
          padding: moderateScale(10),
          borderRadius: moderateScale(10),
        }}>
        <Text style={{color: 'white'}}>Edit</Text>
      </Pressable>


      <View
        style={{
          minHeight: '30%',
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'white',
          borderLeftWidth: 5,
          borderTopWidth: 1,
          borderBottomLeftRadius: moderateScale(70),
        }}>
        <Image
          source={require('../assets/images/user.png')}
          style={{
            height: 150,
            width: 150,
          }}
        />
        <View
          style={{
            // borderWidth: 1,
            borderColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: verticalScale(10),
          }}>
          <Text
            style={{
              fontSize: scale(20),
              fontWeight: '700',

              textAlign: 'center',
              color: 'white',
            }}>
            {name}
          </Text>
          <View
            style={{
              backgroundColor: isAdmin ? '#ff4000' : '#99ff99',
              padding: moderateScale(5),
              marginHorizontal: moderateScale(5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: moderateScale(4),
              flexDirection: 'row',
            }}>
            <View
              style={{
                borderWidth: 3,
                borderColor: isAdmin ? 'pink' : 'green',
                marginRight: moderateScale(3),
                height: moderateScale(10),
                width: moderateScale(10),
                borderRadius: moderateScale(5),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: isAdmin ? 'white' : 'pink',
                  // marginRight: moderateScale(3),
                  height: moderateScale(2),
                  width: moderateScale(2),
                  borderRadius: moderateScale(1),
                }}
              />
            </View>
            {isAdmin ? (
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                }}>
                ADMIN
              </Text>
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                }}>
                USER
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={{
        minHeight: '70%',
        // borderWidth: 1,
        backgroundColor: 'white',
        borderTopRightRadius: moderateScale(70)
        }}>
        <Text style={styles.normalTextHeadingCommonProp}>User Name</Text>
        <Text style={styles.normalTextCommonProp}>{userName}</Text>
        <Text style={styles.normalTextHeadingCommonProp}>Email:</Text>
        <Text style={styles.normalTextCommonProp}>{email}</Text>
        <Text style={styles.normalTextHeadingCommonProp}>Password:</Text>
        <Text style={[styles.normalTextCommonProp, {color: 'black'}]}>
          **********
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 2,
    backgroundColor: 'black'
  },
  normalTextHeadingCommonProp: {
    color: 'black',
    fontWeight: '600',
    fontSize: moderateScale(19),
    marginLeft: moderateScale(10),
    marginTop: moderateScale(10),
  },
  normalTextCommonProp: {
    color: 'black',
    fontWeight: '400',
    fontSize: moderateScale(15),
    marginLeft: moderateScale(10),
    marginTop: moderateScale(5),
  },
});
