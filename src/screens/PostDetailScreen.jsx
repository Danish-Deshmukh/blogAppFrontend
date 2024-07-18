import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

// ICONS
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {Menu, Divider, Button} from 'react-native-paper';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {pageNotFoundError, tockenExpire} from '../CustomeError/Error';
import ImageView from 'react-native-image-viewing';
import Markdown from 'react-native-markdown-display';

export default function PostDetailScreen(item) {
  const post = item.route.params;
  const {isAdmin, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const [serverError, setServerError] = useState(false);
  const [auther, setAuther] = useState('Deshmukh');
  const [fullViewImage, setFullViewImage] = useState(false);
  const navigation = useNavigation();
  const client = useQueryClient();

  const scrollConst = verticalScale(90);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  // Papaer UI state and functions
  const [visible, setVisible] = useState(true);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Get Post BY id
  const fetchPostById = async id => {
    // console.log('page param');
    // console.log(id);
    const url = `${REST_API_BASE_URL}/posts/${id}`;

    const options = {
      method: 'GET',
    };
    const res = await fetch(url, options);
    // console.log(res);
    if (!res.ok) {
      throw new Error(`Faild to fetch Post by ID = ${id}`);
    }
    const json = await res.json();
    // console.log(json)
    return json;
  };
  const id = post.id;
  const {
    data,
    isLoading: postDetailLoading,
    error: postDetailError,
  } = useQuery({
    queryKey: ['postDetail', id],
    queryFn: () => fetchPostById(id),
  });

  console.log(`${REST_API_BASE_URL}/image/${data?.image}`);
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
    navigation.navigate('AddBlog', post);
    Refresh();
    setVisible(false);
  };
  const deletePost = () => {
    console.log('delete called');
    const ID = post.id;
    Refresh();

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

        if (e.response.status >= 500) {
          setServerError(true);
        }
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
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{translateY: translateY}],
            height: moderateScale(50),
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            elevation: 1,
            zIndex: 1,
            backgroundColor: 'white',
          },
        ]}>
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
            columnGap: moderateScale(10),
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
      </Animated.View>

      {/* POST DETAILS */}
      <ScrollView
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        style={styles.container}>
        {/* Below View is for adjusting with the heading height when scrolling  */}
        <View style={{height: moderateScale(50)}} />

        <Text style={[styles.text, styles.headingText]}>{data.title}</Text>
        <Text style={[styles.text, styles.autherText]}>auther: {auther}</Text>
        {data.image && (
          <View>
            <TouchableOpacity onPress={() => setFullViewImage(true)}>
              <Image
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: moderateScale(5),
                  marginBottom: moderateScale(10),
                }}
                source={{
                  uri: `${REST_API_BASE_URL}/image/${data.image}`,
                }}
              />
            </TouchableOpacity>

            <ImageView
              images={[
                {
                  uri: `${REST_API_BASE_URL}/image/${data.image}`,
                },
              ]}
              visible={fullViewImage}
              onRequestClose={() => setFullViewImage(false)}
            />
          </View>
        )}

        <Text style={[styles.text, styles.descText]}>{data.description}</Text>

        <Markdown style={markdownStyles}>{data.content}</Markdown>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 160,
          }}>
          <Text>-*-*-*-* END *-*-*-*-</Text>
        </View>
      </ScrollView>

      {/* For server Error */}
      {serverError &&
        Alert.alert(
          'Something went wrong',
          'Internal Server error problem status code 500',
          [
            {
              text: 'OK',
              onPress: () => {
                setServerError(false);
              },
            },
          ],
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: moderateScale(8),
    // marginTop: moderateScale(50),
    backgroundColor: 'white',
  },
  headerContainer: {
    // backgroundColor: 'gray',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.1,
  },
  text: {
    color: 'black',
  },
  headingText: {
    textAlign: 'left',
    // alignSelf: 'center',
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

const markdownStyles = StyleSheet.create({
  heading1: {
    fontFamily: 'InterBlack',
    color: '#212020',
    marginTop: 15,
    marginBottom: 10,

    lineHeight: 40,
  },
  text: {
    color: 'black',
    // fontSize: moderateScale(19),
    fontWeight: '400',
  },
  heading2: {
    fontFamily: 'InterBold',
    color: '#404040',

    marginTop: 10,
    marginBottom: 5,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    // fontFamily: 'Inter',
    lineHeight: 24,
    backgroundColor: 'white',
  },
  fence: {
    // backgroundColor: 'white',
    marginVertical: moderateScale(10),
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
  },
  code_block: {
    borderWidth: 1,
    borderColor: 'red',
  },
});
