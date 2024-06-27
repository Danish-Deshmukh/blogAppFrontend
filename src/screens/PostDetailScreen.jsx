import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

// ICONS
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import {REST_API_BASE_URL} from '../service/REST_API_BASE_URL';
import {AuthContext} from '../context/AuthContext';
import {Menu, Divider, Button} from 'react-native-paper';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchPostById} from '../service/fetchPosts';
import {pageNotFoundError, tockenExpire} from '../CustomeError/Error';

export default function PostDetailScreen(item) {
  const post = item.route.params;
  const {isAdmin, userInfo} = useContext(AuthContext);
  const [auther, setAuther] = useState('Deshmukh Danish');
  const navigation = useNavigation();
  const client = useQueryClient();

  // Papaer UI state and functions
  const [visible, setVisible] = useState(true);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Get Post BY id
  const id = post.id;
  const {
    data,
    isLoading: postDetailLoading,
    error: postDetailError,
  } = useQuery({
    queryKey: ['postDetail', id],
    queryFn: () => fetchPostById(id),
  });
  if (postDetailLoading) {
    return (
      <ActivityIndicator style={{flex: 1}} size={'large'} color={'black'} />
    );
  }
  if (postDetailError) {
    return (
      <Text
        style={{
          flex: 1,
          alignSelf: 'center',
          color: 'red',
        }}>
        {postDetailError}
      </Text>
    );
  }

  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const updatePost = () => {
    console.log('Update post called');
    console.log(post);
    navigation.navigate('AddBlog', post);
    setVisible(false);
  };
  const deletePost = () => {
    console.log('delete called');
    const ID = post.id;

    axios
      .delete(`${REST_API_BASE_URL}/posts/${ID}`, config)
      .then(res => {
        console.log(res);
        Refresh();
        navigation.navigate('Home');
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
    <View style={{flex: 1}}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // borderWidth: 1,
            width: moderateScale(90),
            height: '100%',
            // width: '50%',
            justifyContent: 'space-between',
          }}>
          <FeatherIcons
            name={'arrow-left'}
            size={moderateScale(22)}
            color="black"
          />
          <Text
            style={{
              fontWeight: '600',
              fontSize: moderateScale(20),
              color: 'black',
            }}>
            Back
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row'}}>
          {/* COMMENT ICON HERE */}
          <TouchableOpacity
            style={{
              // borderWidth: 1,
              borderRadius: moderateScale(40),
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
            onPress={() => {
              navigation.navigate('ShowPostComments', post.id);
              // handleOpenPress();
              // getAllComments();
            }}>
            <FeatherIcons
              name={'message-circle'}
              size={moderateScale(35)}
              color="black"
            />
          </TouchableOpacity>

          {/* UPDATE AND DELETE USER */}
          {isAdmin && (
            <View style={{marginLeft: moderateScale(5)}}>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <Button onPress={openMenu}>
                    <FeatherIcons
                      name={'more-vertical'}
                      size={moderateScale(21)}
                      color="black"
                    />
                  </Button>
                }>
                <View
                  style={{
                    backgroundColor: '#f0f0f0',
                  }}>
                  <Menu.Item
                    onPress={() => {
                      updatePost();
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
                          name={'update'}
                          size={moderateScale(20)}
                          color="black"
                        />
                        <Text
                          style={{
                            marginLeft: moderateScale(10),
                            fontWeight: '600',
                            fontSize: moderateScale(16),
                          }}>
                          UPDATE
                        </Text>
                      </View>
                    }
                  />
                  <Divider />
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
                              deletePost();
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
                          DELETE
                        </Text>
                      </View>
                    }
                  />
                </View>
              </Menu>
            </View>
          )}
        </View>
      </View>

      {/* POST DETAILS */}
      <ScrollView style={styles.container}>
        {data.image && (
          <Image
            style={{
              width: '100%',
              height: 200,
              borderRadius: moderateScale(5),
              marginBottom: moderateScale(10)
            }}
            source={{
              uri: `${REST_API_BASE_URL}/image/${data.image}`,
            }}
          />
        )}

        <Text style={[styles.text, styles.headingText]}>{data.title}</Text>
        <Text style={[styles.text, styles.autherText]}>auther: {auther}</Text>
        <Text style={[styles.text, styles.descText]}>{data.description}</Text>
        <Text style={[styles.text, styles.bodyText]}>
          {'   '}
          {data.content}
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: moderateScale(8),
  },
  headerContainer: {
    // backgroundColor: 'gray',
    height: moderateScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.2,
  },
  text: {
    color: 'black',
  },
  headingText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: moderateScale(25),
    fontWeight: '600',
  },
  autherText: {
    alignSelf: 'center',
    fontWeight: '500',
    color: 'gray',
    marginVertical: moderateScale(5),
  },
  descText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: moderateScale(15),
  },
  bodyText: {
    color: 'black',
    marginTop: verticalScale(20),
  },
  commentsHeadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
  },
});
