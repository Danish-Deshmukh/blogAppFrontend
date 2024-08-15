import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

// Icons
import FeatherIcons from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import {useQuery, useQueryClient} from '@tanstack/react-query';

export default function Card({item}) {
  const {logout, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const navigation = useNavigation();
  const client = useQueryClient();
  const [coverImage, setCoverIamge] = useState();

  // Bookmark states and methods
  const [isBookMark, setIsBookMark] = useState(false);
  const [isBookMarkLoading, setIsBookMarkLoading] = useState(false);
  // QUERY FOR FETCHING POSTS BY User ID
  const fetchBookmarkedPosts = async () => {
    const url = `${REST_API_BASE_URL}/bookmarks/user/${userInfo.userId}`;

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Faild to fetch Posts by this category');
    }
    const json = await res.json();
    return json;
  };
  const {
    data: bookmarkPosts,
    error: bookmarkError,
    isLoading: bookmarkIsLoading,
  } = useQuery({
    queryKey: ['bookmarkedPosts'],
    queryFn: () => fetchBookmarkedPosts(),
  });
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const addBookmark = async () => {
    setIsBookMarkLoading(true);

    if (CheackingIsBookmark === true) {
      console.log('inside the cheakng book mark ');
      ToastAndroid.show('Post is already bookmarked', 1000);
      setIsBookMarkLoading(false);
    } else {
      const body = {
        userId: userInfo.userId,
        postId: item.id,
      };
      await axios
        .post(`${REST_API_BASE_URL}/bookmarks/add`, body, config)
        .then(res => {
          // console.log(res);
          setIsBookMark(true);
          ToastAndroid.show('Post added in the bookmark', 1000);
          setIsBookMarkLoading(false);
          client.invalidateQueries(['bookmarkedPosts']);
        })
        .catch(e => {
          console.log(`register error --------------> ${e}`);
          console.log(e.response.status);
          setIsBookMarkLoading(false);

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
    }
  };
  const removeBookmark = async () => {
    setIsBookMarkLoading(true);

    const url = `${REST_API_BASE_URL}/bookmarks/remove?userId=${userInfo.userId}&postId=${item.id}`;

    await axios
      .delete(url, config)
      .then(res => {
        // console.log(res);
        setIsBookMark(false);
        ToastAndroid.show('Post remove from the bookmark', 1000);
        setIsBookMarkLoading(false);
        client.invalidateQueries(['bookmarkedPosts']);
        client.invalidateQueries(['posts']);
        client.invalidateQueries(['postByCategory']);
      })

      .catch(e => {
        console.log(`register error --------------> ${e}`);
        console.log(e.response.status);
        setIsBookMarkLoading(false);

        if (e.response.status >= 500) {
          serverError();
        }
        if (e.response.status === 404) {
          setIsBookMark(false);
          pageNotFoundError();
        }
        if (e.response.status === 401) {
          tockenExpire();
        }
      });
  };

  const CheackingIsBookmark = async () => {
    if (bookmarkPosts) {
      await bookmarkPosts.map(post => {
        if (item.id === post.id) {
          setIsBookMark(true);
          return true;
        }
        return false;
      });
    }
  };

  useEffect(() => {
    CheackingIsBookmark();
  }, []);
  useEffect(() => {
    imageSetter();

    // Cheacking if the post is bookmarked or not
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

  // Errors
  const serverError = () => {
    Alert.alert(
      'Something went wrong',
      'Internal Server error problem status code 500',
      [
        {
          text: 'OK',
        },
      ],
    );
  };
  const pageNotFoundError = () => {
    Alert.alert(
      'Something went wrong!!!',
      'Post is not present in the database you need to restart the application to see the changes',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
        },
      ],
    );
  };
  const tockenExpire = () => {
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
  };
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostDetailScreen', item)}
      style={{
        margin: moderateScale(5),
        borderRadius: moderateScale(5),
        height: verticalScale(160),
        elevation: 2,
        // borderWidth: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
      }}>
      {/* // Bookmark Icon */}
      <TouchableOpacity
        onPress={() => {
          if (userInfo.accessToken) {
            if (isBookMark) {
              removeBookmark();
            } else {
              addBookmark();
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
          position: 'absolute',
          right: moderateScale(0),
          top: moderateScale(5),
          zIndex: 1,
          // borderWidth: 1,
          width: '15%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isBookMarkLoading ? (
          <ActivityIndicator color="black" size={'small'} />
        ) : (
          <Fontisto
            name={isBookMark ? 'bookmark-alt' : 'bookmark'}
            size={moderateScale(25)}
          />
        )}
      </TouchableOpacity>

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
      <View
        style={{
          // borderWidth: 1,
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: moderateScale(40),
          width: moderateScale(60),
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: moderateScale(5),
          }}>
          <FeatherIcons
            name={'message-circle'}
            size={moderateScale(20)}
            // color="gray"
          />
          <Text style={{fontSize: moderateScale(17)}}>
            {item.comments.length}
          </Text>
        </View>
      </View>
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
