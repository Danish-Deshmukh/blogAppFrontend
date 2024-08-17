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
import Modal from 'react-native-modal';

// ICONS
import FeatherIcons from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ImageView from 'react-native-image-viewing';
import Markdown from 'react-native-markdown-display';
import ShowPostComments from '../components/ShowPostComments';
import useBookmark from '../CustomHooks/useBookmark';
import useErrors from '../CustomHooks/useErrors';

export default function PostDetailScreen(item) {
  const post = item.route.params;
  // console.log('---------->');
  // console.log(post);
  const {isAdmin, userInfo, logout, REST_API_BASE_URL} =
    useContext(AuthContext);
  const {serverError, pageNotFoundError, tockenExpire} = useErrors();
  const [auther, setAuther] = useState('Deshmukh');
  const [fullViewImage, setFullViewImage] = useState(false);
  const navigation = useNavigation();
  const client = useQueryClient();

  const [showMenuModel, setShowMenuModel] = useState(false);
  const scrollConst = verticalScale(90);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  const [showComments, setShowComments] = useState(false);

  // Get Post BY id
  const fetchPostById = async id => {
    // If the use is not login then user Id is going to be zero because in the database user with id zero is not present
    const userId = userInfo.userId === undefined ? 0 : userInfo.userId;
    const url = `${REST_API_BASE_URL}/posts/${id}?userId=${userId}`;

    const options = {
      method: 'GET',
    };
    const res = await fetch(url, options);
    // console.log(res);
    if (!res.ok) {
      throw new Error(`Faild to fetch Post by ID = ${id}`);
    }
    const json = await res.json();
    // console.log('this is json data ------------> ');
    // console.log(json);
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

  const [coverImage, setCoverIamge] = useState();

  // Bookmark Hook
  const {
    isBookMark,
    setIsBookMark,
    addBookmark,
    removeBookmark,
    isBookMarkLoading,
  } = useBookmark();

  useEffect(() => {
    imageSetter();
    if (data?.bookmarked) {
      setIsBookMark(true);
    }
  }, [data]);
  const imageSetter = () => {
    const url = data?.coverImage;
    if (url === undefined || url === null || url === '') {
      return;
    }
    if (url.startsWith('https://')) {
      return;
    } else {
      setCoverIamge(`${REST_API_BASE_URL}/image/${data.coverImage}`);
    }
  };

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
    navigation.navigate('AddContent', post);
    Refresh();
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
          serverError();
        }
        if (e.response.status === 404) {
          pageNotFoundError();
        }

        if (e.response.status === 401) {
          tockenExpire();
        }
      });
  };
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
            navigation.goBack();
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

        <View
          style={{
            flexDirection: 'row',
            // borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30,
          }}>
          {/* Bookmark Icon here */}
          {isBookMarkLoading ? (
            <ActivityIndicator color={'black'} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (userInfo.accessToken) {
                  if (isBookMark) {
                    removeBookmark(post.id);
                  } else {
                    addBookmark(post.id);
                  }
                }
                // if user didn't have a account or not logedin
                else {
                  Alert.alert(
                    "didn't hava a account",
                    'You need to have an accound for bookmarking any post',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Login',
                        onPress: () => navigation.navigate('Login'),
                      },
                    ],
                  );
                }
              }}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(40),
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}>
              <Fontisto
                name={isBookMark ? 'bookmark-alt' : 'bookmark'}
                // name={'bookmark'}
                size={moderateScale(28)}
                color={'black'}
              />
            </TouchableOpacity>
          )}

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
              // navigation.navigate('ShowPostComments', post.id);
              setShowComments(true);
              // handleOpenPress();
              // getAllComments();
            }}>
            <FeatherIcons
              name={'message-circle'}
              size={moderateScale(35)}
              color="black"
            />
          </TouchableOpacity>

          {/* Three dot menu */}
          {/* UPDATE AND DELETE USER */}
          {isAdmin && (
            <>
              {/* Three dot menu button */}
              <View style={{marginLeft: moderateScale(5)}}>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenuModel(true);
                  }}>
                  <Feather
                    name={'more-vertical'}
                    size={moderateScale(22)}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              {/* Model for Three dot menu */}
              <Modal
                isVisible={showMenuModel}
                onBackdropPress={() => setShowMenuModel(false)}
                animationIn={'fadeInRight'}
                animationOut={'fadeOutRight'}
                backdropOpacity={0}>
                <View
                  style={{
                    minHeight: moderateScale(100),
                    width: moderateScale(140),
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    backgroundColor: '#FFFFFF',
                    borderRadius: moderateScale(5),
                    elevation: 10,
                  }}>
                  {/* Update BUTTON */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenuModel(false);
                      updatePost();
                    }}
                    style={{
                      width: '100%',
                      height: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'lightgreen',
                        fontWeight: 'bold',
                        fontSize: 17,
                      }}>
                      UPDATE
                    </Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View
                    style={{
                      backgroundColor: 'gray',
                      width: '90%',
                      height: 1,
                      alignSelf: 'center',
                    }}
                  />

                  {/* Delete Button here */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenuModel(false);
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
                    style={{
                      // borderBottomWidth: 1,
                      borderColor: 'white',
                      width: '100%',
                      height: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // borderRadius: moderateScale(10),
                    }}>
                    <Text
                      style={{color: 'pink', fontWeight: 'bold', fontSize: 17}}>
                      DELETE
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          )}
        </View>
      </Animated.View>

      {/* Show comment model */}
      <Modal
        isVisible={showComments}
        onBackButtonPress={() => setShowComments(false)}
        onBackdropPress={() => setShowComments(false)}
        // animationIn={''}
        // animationOut={'fadeOutRight'}
        // backdropOpacity={0}
      >
        <View
          style={{
            // flex: 1,
            height: '100%',
            position: 'absolute',
            bottom: -20,
            backgroundColor: 'white',
            width: '110%',
            alignSelf: 'center',
            borderRadius: moderateScale(20),
            paddingTop: moderateScale(5),
            // paddingBottom: moderateScale(30)
          }}>
          {/* Comments header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}>
            <Text
              style={{
                fontSize: moderateScale(20),
                color: 'black',
                fontWeight: '700',
              }}>
              Comments
            </Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <AntDesign
                name={'close'}
                size={moderateScale(30)}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <ShowPostComments item={post.id} setShowComments={showComments} />
        </View>
      </Modal>

      {/* POST DETAILS */}
      <ScrollView
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        style={styles.container}>
        {/* Below View is for adjusting with the heading height when scrolling  */}
        <View style={{height: moderateScale(50)}} />

        {/* <Text style={[styles.text, styles.headingText]}>{data.title}</Text> */}
        {/* <Text style={[styles.text, styles.autherText]}>auther: {auther}</Text> */}
        {coverImage && (
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
                  uri: coverImage,
                }}
              />
            </TouchableOpacity>

            <ImageView
              images={[
                {
                  uri: coverImage,
                },
              ]}
              visible={fullViewImage}
              onRequestClose={() => setFullViewImage(false)}
            />
          </View>
        )}

        {/* <Text style={[styles.text, styles.descText]}>{data.description}</Text> */}

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
    // backgroundColor: '#FFFF',
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
