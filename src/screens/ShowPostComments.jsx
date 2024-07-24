import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  FlatList,
  Image,
  NativeEventEmitter,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';

// ICONS
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AuthContext} from '../context/AuthContext';
import {ActivityIndicator, Menu} from 'react-native-paper';
import {pageNotFoundError, tockenExpire} from '../CustomeError/Error';

const ShowPostComments = ({item}) => {
  const id = item;
  console.log('item ' + item);
  const {isAdmin, userInfo, logout, REST_API_BASE_URL} =
    useContext(AuthContext);
  const navigation = useNavigation();
  const client = useQueryClient();

  // Comment card states and functions
  const [menuVisible, setMenuVisible] = useState({});
  const openMenu = id => {
    setMenuVisible(prev => ({...prev, [id]: true}));
  };

  const closeMenu = id => {
    setMenuVisible(prev => ({...prev, [id]: false}));
  };

  const deleteComment = commentId => {
    const postId = id;
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

  // Comments state and functions
  const getAllComments = async () => {
    const ID = id;
    const url = `${REST_API_BASE_URL}/posts/${ID}/comments`;

    const options = {
      method: 'GET',
    };
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error('Faild to fetch Comments');
    }
    const json = await res.json();
    return json;
  };
  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ['comments'],
    queryFn: getAllComments,
  });

  // Add Comment states functions
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const addComment = (id, name, email, body) => {
    const postId = id;
    axios
      .post(
        `${REST_API_BASE_URL}/posts/${postId}/comments`,
        {
          name,
          email,
          body,
        },
        config,
      )
      .then(res => {
        client.invalidateQueries(['comments']);
        setComment('');
      })
      .catch(e => {
        console.log(`register error hehehehehe ${e}`);

        console.log(e.response.status);
        if (e.response.status === 404) {
          pageNotFoundError();
        }

        if (e.response.status === 401) {
          Alert.alert(
            'Token Expire',
            'You need to login again to preform this operation, Press "OK" to logout ',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  logout();
                  navigation.navigate('Login');
                },
              },
            ],
          );
        }
      });
  };

  // Update Comment states functins
  const [updatingCommentInProcess, setUpdatingCommentInProcess] =
    useState(false);
  const [updatingCommentUser, setUpdatingCommentUser] = useState({});

  const updateComment = () => {
    const commentId = updatingCommentUser.commentId;
    const name = updatingCommentUser.name;
    const email = updatingCommentUser.email;
    const body = comment;

    axios
      .put(
        `${REST_API_BASE_URL}/posts/${id}/comments/${commentId}`,
        {
          name,
          email,
          body,
        },
        config,
      )
      .then(res => {
        console.log(res);
        setComment('');
        setUpdatingCommentInProcess(false);
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
        // marginBottom: moderateScale(150),
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 70,
        // borderWidth: 1
      }}>
      {/* Comments header */}
      {/* <View style={styles.commentsHeadContainer}>
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'black',
            fontWeight: '700',
          }}>
          Comments
        </Text>
        <TouchableOpacity
          onPress={() => {
            setShowComments(false);
            // navigation.goBack();
          }}>
          <AntDesign name={'close'} size={moderateScale(30)} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Comment Input */}
      <View
        style={{
          borderWidth: 1,
          borderRadius: moderateScale(10),
          height: moderateScale(50),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: moderateScale(10),
          width: '95%',
          margin: moderateScale(10),
        }}>
        <View
          style={{
            // borderWidth : 1,
            width: '90%',
          }}>
          <TextInput
            multiline
            placeholder={
              commentError
                ? 'Comment should not be empty...'
                : 'Comment your thoughts...'
            }
            placeholderTextColor={commentError && 'red'}
            value={comment}
            onChangeText={comment => setComment(comment)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (userInfo.accessToken) {
              const name = userInfo.name;
              const email = userInfo.email;
              const body = comment;

              comment === ''
                ? setCommentError(true)
                : updatingCommentInProcess
                ? updateComment()
                : addComment(id, name, email, body);
            } else {
              Alert.alert(
                "didn't hava a account",
                'You need to have an accound for commenting on any post',
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
          style={{borderWidth: 0}}>
          {updatingCommentInProcess ? (
            <MaterialCommunityIcons
              name="update"
              size={moderateScale(20)}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons
              name="send"
              size={moderateScale(20)}
              color="black"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Comments Body */}
      <View
        style={{
          //   borderWidth: 1,
          //   marginBottom: moderateScale(80),
          padding: moderateScale(10),
          //   height: '50%',
        }}>
        {commentsLoading && (
          <View>
            <ActivityIndicator color="black" />
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={comments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            // Comment Card
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
                    borderRadius: moderateScale(15),
                    width: moderateScale(30),
                    height: moderateScale(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => openMenu(item.id)}>
                    <FeatherIcons
                      name={'more-vertical'}
                      size={moderateScale(21)}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Modal
                    isVisible={menuVisible[item.id] || false}
                    onBackdropPress={() => closeMenu(item.id)}
                    
                    style={{
                      margin: 0,
                      justifyContent: 'flex-end',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#f0f0f0',
                        padding: moderateScale(30),
                        borderRadius: moderateScale(10),
                        gap: 20,
                      }}>
                      {userInfo.name === item.name && (
                        <TouchableOpacity
                          onPress={() => {
                            const UpdatingCommentUser = {
                              commentId: item.id,
                              name: item.name,
                              email: item.email,
                            };
                            setUpdatingCommentUser(UpdatingCommentUser);
                            setUpdatingCommentInProcess(true);
                            closeMenu(item.id);
                            setComment(item.body);
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: moderateScale(10),
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
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Delete Comment',
                            'Are you sure you want to delete this comment?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: () => {
                                  deleteComment(item.id);
                                },
                              },
                            ],
                          );
                        }}
                        style={{
                          flexDirection: 'row',
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
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
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
          )}
        />
      </View>
    </View>
  );
};

export default ShowPostComments;

const styles = StyleSheet.create({
  commentsHeadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
  },
});
