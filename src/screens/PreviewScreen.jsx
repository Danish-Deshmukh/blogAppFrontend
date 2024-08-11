import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import Markdown from 'react-native-markdown-display';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import BlackButton from '../components/BlackButton';

const PreviewScreen = item => {
  const post = item.route.params;
  // console.log('=======================');
  // console.log(post);

  const {isAdmin, logout, userInfo, REST_API_BASE_URL} =
    useContext(AuthContext);
  const [serverError, setServerError] = useState(false);
  const navigation = useNavigation();

  // let imageUri =
  //   post?.image?.uri || post?.image?.assets?.[0]?.uri || post.image;

  // Animation related
  const scrollConst = verticalScale(150);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const bottomTranslateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, scrollConst],
  });

  // Refreshing queries after Updating or Adding the post
  const client = useQueryClient();
  const Refresh = () => {
    // client.clear();
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };

  // Configuration if the Image is available
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  // Configuration if the Image is not available
  const configForNoImage = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const FinalPrivewScreen = () => {
    navigation.navigate('FinalPrivewScreen', post);
  };
  // const submitPost = () => {
  //   console.log('submit button called');
  //   console.log(REST_API_BASE_URL);
  //   const title = post.title;
  //   const description = post.description;
  //   const content = post.content;
  //   const categoryId = post.categoryId;
  //   const image = post.image;

  //   // If the Image is available then this If statemtnt going to execute
  //   if (image != null) {
  //     console.log('if black called ');

  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: image?.assets?.[0]?.uri,
  //       type: image?.assets?.[0]?.type,
  //       name: image?.assets?.[0]?.fileName,
  //       fileName: image?.assets?.[0]?.fileName,
  //     });

  //     const postDto = JSON.stringify({
  //       title: title,
  //       description: description,
  //       content: content,
  //       categoryId: categoryId,
  //     });

  //     formData.append('postDto', postDto);

  //     axios
  //       .post(`${REST_API_BASE_URL}/posts/withFile`, formData, config)
  //       .then(res => {
  //         console.log(res);
  //         Refresh();
  //         navigation.navigate('Home');
  //       })
  //       .catch(e => {
  //         console.log(`error------------> ${e}`);

  //         console.log(e.response.status);
  //         if (e.response.status === 404) {
  //           pageNotFoundError();
  //         }

  //         if (e.response.status === 401) {
  //           tockenExpire();
  //         }
  //       });
  //   }
  //   // If the Image is not available then this is going to excecute
  //   else {
  //     console.log('else block called ');
  //     console.log(title);
  //     console.log(description);
  //     console.log(content);
  //     console.log(categoryId);

  //     axios
  //       .post(
  //         `${REST_API_BASE_URL}/posts`,
  //         {
  //           title,
  //           description,
  //           content,
  //           categoryId,
  //         },
  //         configForNoImage,
  //       )
  //       .then(res => {
  //         console.log(res);
  //         Refresh();
  //         navigation.navigate('Home');
  //       })
  //       .catch(e => {
  //         console.log(`error------------> ${e}`);

  //         console.log(e.response.status);
  //         if (e.response.status === 404) {
  //           pageNotFoundError();
  //         }

  //         if (e.response.status === 401) {
  //           tockenExpire();
  //         }
  //       });
  //   }
  // };

  // const updatePost = () => {
  //   console.log('Update method called');
  //   console.log(REST_API_BASE_URL);
  //   const ID = post.id;
  //   const title = post.title;
  //   const description = post.description;
  //   const content = post.content;
  //   const categoryId = post.categoryId;
  //   const image = post.image;

  //   const formData = new FormData();

  //   if (image != null) {
  //     console.log('Defining this if the file is exist');
  //     formData.append('file', {
  //       uri: image.assets?.[0]?.uri,
  //       type: image.assets?.[0]?.type,
  //       name: image.assets?.[0]?.fileName,
  //       fileName: image.assets?.[0]?.fileName,
  //     });
  //   }

  //   if (image === null) {
  //     console.log('Defining if file is null');
  //     formData.append('file', null);
  //   }

  //   const postDto = JSON.stringify({
  //     title: title,
  //     description: description,
  //     content: content,
  //     categoryId: categoryId,
  //   });

  //   formData.append('postDto', postDto);

  //   axios
  //     .put(`${REST_API_BASE_URL}/posts/${ID}`, formData, config)
  //     .then(res => {
  //       console.log(res);
  //       Refresh();
  //       navigation.navigate('Home');
  //     })
  //     .catch(e => {
  //       console.log(`register error --------------> ${e}`);
  //       console.log(e.response);
  //       // console.log(e.response.status);

  //       if (e.response.status >= 500) {
  //         setServerError(true);
  //       }
  //       if (e.response.status === 404) {
  //         pageNotFoundError();
  //       }

  //       if (e.response.status === 401) {
  //         tockenExpire();
  //       }
  //     });
  // };

  const pageNotFoundError = () => {
    Alert.alert(
      'Post Not found',
      'Post is not present in the database you need to restart the application to see the changes ',
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
    <>
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
      <ScrollView
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        style={styles.container}>
        {/* <Text style={[styles.text, styles.headingText]}>{post.title}</Text> */}
        {/* {post.image && (
          <View>
            <Image
              style={{
                width: '100%',
                height: 200,
                borderRadius: moderateScale(5),
                marginBottom: moderateScale(10),
              }}
              source={{
                uri: imageUri,
              }}
            />
          </View>
        )} */}

        {/* <Text style={[styles.text, styles.descText]}>{post.description}</Text> */}
        {/* <Text style={[styles.text, styles.bodyText]}>{post.content}</Text> */}
        <Markdown style={markdownStyles}>{post.content}</Markdown>
        <View style={{height: 160}} />
      </ScrollView>

      <Animated.View
        style={{
          transform: [{translateY: bottomTranslateY}],
          width: '100%',
          height: moderateScale(100),
          // borderWidth: 1,
          backgroundColor: '#e6ffe6',
          position: 'absolute',
          bottom: 0,
          padding: moderateScale(20),
          elevation: 15,
          borderTopRightRadius: moderateScale(20),
          borderTopLeftRadius: moderateScale(20),
          zIndex: 1,
        }}>
        <View
          style={{
            height: moderateScale(35),
            // borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BlackButton title={'Next'} onPress={FinalPrivewScreen} />
        </View>
      </Animated.View>
    </>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: moderateScale(10),
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
  button: {
    height: moderateScale(40),
    width: '60%',
    borderWidth: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(5),
    backgroundColor: 'black',
  },
  buttonTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
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
    // fontWeight: '400',
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
