import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
// ICONS
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale} from 'react-native-size-matters';
import {AuthContext} from '../context/AuthContext';
import {Button, IconButton, Menu} from 'react-native-paper';
import {useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {pageNotFoundError, tockenExpire} from '../CustomeError/Error';

const CommentCard = ({id, item}) => {
  const {isAdmin, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const client = useQueryClient();
  const [editComment, setEditComment] = useState(false);

  //   Papaer UI state and functions
  const [visible, setVisible] = useState(true);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const handleDelete = () => {
    const postId = id;
    const commentId = item.id;
    console.log(`Deleted comment: ${commentId}`);
    console.log(`Post id: ${postId}`);

    axios
      .delete(
        `${REST_API_BASE_URL}/posts/${postId}/comments/${commentId}`,
        config,
      )
      .then(res => {
        console.log(res);
        client.invalidateQueries(['comments']);
      })
      .catch(e => {
        console.log(`register error --------------> ${e}`);
        console.log(e.response.status);

        if (e.response.status === 404) {
          pageNotFoundError();
        }

        if (e.response.status === 401) {
          tockenExpire();
        }
      });
  };
  return (
    <View
      style={{
        backgroundColor: userInfo.name === item.name && 'lightgreen',
        borderWidth: 0.4,
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        marginVertical: moderateScale(5),
        paddingVertical: moderateScale(15),
        paddingRight: moderateScale(65),
        // marginBottom: moderateScale(120)
      }}>
      {/* Three dots for more options */}
      {(userInfo.name === item.name || isAdmin) && (
        <View
          style={{
            position: 'absolute',
            right: moderateScale(10),
            top: moderateScale(10),
            // borderWidth: 1,
            borderRadius: moderateScale(15),
            width: moderateScale(30),
            height: moderateScale(30),
            justifyContent: 'center',
            alignItems: 'center',
            // padding: moderateScale(15)
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <FeatherIcons
                  name={'more-vertical'}
                  size={moderateScale(21)}
                  color="black"
                />
              </TouchableOpacity>
            }>
            <View
              style={{
                backgroundColor: '#f0f0f0',
              }}>
              <Menu.Item
                onPress={() => {
                  Alert.alert(
                    'Delete Post',
                    'Are you sure you want to Delete this post',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          console.log('updated called');
                        },
                      },
                    ],
                  );
                }}
                title={
                  <View
                    style={{
                      // borderWidth: 1,
                      // padding: moderateScale(10),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={'square-edit-outline'}
                      size={moderateScale(20)}
                      color="black"
                    />
                    <Text
                      style={{
                        marginLeft: moderateScale(10),
                        fontWeight: '600',
                        fontSize: moderateScale(16),
                        color: 'green',
                      }}>
                      Edit
                    </Text>
                  </View>
                }
              />
              <Menu.Item
                onPress={() => {
                  Alert.alert(
                    'Delete Post',
                    'Are you sure you want to Delete this post',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          handleDelete();
                        },
                      },
                    ],
                  );
                }}
                title={
                  <View
                    style={{
                      // borderWidth: 1,
                      // padding: moderateScale(10),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={'delete'}
                      size={moderateScale(20)}
                      color="black"
                    />
                    <Text
                      style={{
                        marginLeft: moderateScale(10),
                        fontWeight: '600',
                        fontSize: moderateScale(16),
                        color: 'tomato',
                      }}>
                      DETELE
                    </Text>
                  </View>
                }
              />
            </View>
          </Menu>
        </View>
      )}

      <Image
        source={require('../assets/images/user.png')}
        style={{
          height: moderateScale(25),
          width: moderateScale(25),
          marginHorizontal: moderateScale(10),
          marginTop: moderateScale(3),
        }}
      />
      <View>
        <Text style={{color: 'gray'}}>{item.name}</Text>
        <Text
          style={{
            fontSize: moderateScale(17),
            textAlign: 'justify',
            color: 'black',
          }}>
          {item.body}
        </Text>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({});
