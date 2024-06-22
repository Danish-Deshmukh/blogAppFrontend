import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {AuthContext} from '../context/AuthContext';
import Button from '../components/Button';
import axios from 'axios';
import {REST_API_BASE_URL} from '../service/REST_API_BASE_URL';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import {object, string, number, date, InferType} from 'yup';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchAllCategories} from '../service/fetchPosts';

const AddBlog = item => {
  const readableItem = item.route.params;
  const {userInfo, logout} = useContext(AuthContext);
  const [expiredToken, setExpiredToken] = useState(false);
  const [post, setPost] = useState(readableItem);
  const [categoryId, setCategoryId] = useState();
  const navigation = useNavigation();
  const client = useQueryClient();

  // QUERY AND STATES FOR FETCHING CATEGORIES
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategories,
  });

  useEffect(() => {
    if (readableItem) {
      console.log('----------------');
      setCategoryId(readableItem.categoryId);
    }
  }, []);
  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };
  let userSchema = object({
    title: string()
      .required('Please Enter Title')
      .min(3, 'Title must be 3 or more charactors'),
    description: string()
      .required('Please Enter Description')
      .min(5, 'description should be 5 or more charactors'),
    content: string()
      .required('Please Enter Content')
      .min(10, 'content should not be less then 10 charactors'),
  });
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };

  const submitPost = (title, description, content) => {
    axios
      .post(
        `${REST_API_BASE_URL}/posts`,
        {
          title,
          description,
          content,
          categoryId,
        },
        config,
      )
      .then(res => {
        console.log(res);
        Refresh();
        navigation.navigate('Home');
      })
      .catch(e => {
        console.log(`register error hehehehehe ${e}`);

        console.log(e.response.status);
        if (e.response.status === 404) {
          pageNotFoundError();
        }

        if (e.response.status === 401) {
          tockenExpire();
        }
      });
  };
  const updatePost = (title, description, content) => {
    console.log('Update method called');
    const ID = post.id;

    axios
      .put(
        `${REST_API_BASE_URL}/posts/${ID}`,
        {
          title,
          description,
          content,
          categoryId,
        },
        config,
      )
      .then(res => {
        console.log(res);
        Refresh();
        navigation.goBack();
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
    <ScrollView
      style={{
        flex: 1,
        padding: moderateScale(20),
      }}>
      <Formik
        validationSchema={userSchema}
        style={styles.wrapper}
        initialValues={
          post
            ? {
                title: post.title,
                description: post.description,
                content: post.content,
                categoryId: post.categoryId,
              }
            : {
                title: '',
                description: '',
                content: '',
              }
        }
        onSubmit={values => {
          post
            ? updatePost(values.title, values.description, values.content)
            : submitPost(values.title, values.description, values.content);
        }}>
        {({handleChange, handleSubmit, values, errors}) => (
          <View>
            <Text style={styles.titleText}>Title : </Text>
            <TextInput
              style={styles.titleText}
              value={values.title}
              onChangeText={handleChange('title')}
              multiline
              placeholder="Enter title here..."
            />
            {errors.title && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.title}
              </Text>
            )}

            {/* Description */}
            <Text style={styles.descriptionText}>Description : </Text>
            <TextInput
              style={styles.descriptionText}
              value={values.description}
              onChangeText={handleChange('description')}
              // onBlur={handleBlur('title')}
              multiline
              placeholder="Enter description here..."
            />
            {errors.description && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.description}
              </Text>
            )}

            {/* Content */}
            <Text style={styles.contentText}>Content : </Text>
            <TextInput
              style={styles.contentText}
              value={values.content}
              onChangeText={handleChange('content')}
              // onBlur={handleBlur('title')}
              multiline
              placeholder="Enter content here..."
            />
            {errors.content && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.content}
              </Text>
            )}

            {/* SELECT CATEGORY */}
            <View
              style={{
                borderWidth: 1,
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                height: moderateScale(100),
              }}>
              <FlatList
                horizontal={true}
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      id = item.id;
                      setCategoryId(id);
                    }}
                    style={{
                      borderWidth: 0.8,
                      borderColor: 'black',
                      paddingVertical: moderateScale(6),
                      paddingHorizontal: moderateScale(15),
                      margin: moderateScale(4),
                      marginTop: moderateScale(9),
                      borderRadius: moderateScale(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        categoryId === item.id ? 'black' : 'white',
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: categoryId === item.id ? 'white' : 'black',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <Button onPress={handleSubmit} title={post ? 'Update' : 'Post'} />
          </View>
        )}
      </Formik>
      {/* TITL */}
      {/* <Text style={styles.titleText}>Title : </Text>
      <TextInput
        style={styles.titleText}
        value={title}
        onChangeText={txt => setTitle(txt)}
        multiline
        placeholder="Enter title here..."
      /> */}

      {/* Description */}
      {/* <Text style={styles.descriptionText}>Description : </Text>
      <TextInput
        style={styles.descriptionText}
        value={description}
        onChangeText={txt => setDescription(txt)}
        multiline
        placeholder="Enter Description Here"
      /> */}

      {/* Content */}

      {/* <Text style={styles.contentText}>Content : </Text>
      <TextInput
        style={styles.contentText}
        value={content}
        onChangeText={txt => setContent(txt)}
        multiline
        placeholder="Enter Content Here"
      /> */}
    </ScrollView>
  );
};

export default AddBlog;

const styles = StyleSheet.create({
  titleText: {
    // borderWidth: 0.5,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  descriptionText: {},
  contentText: {},
});
