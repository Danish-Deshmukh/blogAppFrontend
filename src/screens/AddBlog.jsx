import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {AuthContext} from '../context/AuthContext';
import Button from '../components/Button';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import {object, string, number, date, InferType} from 'yup';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useQuery, useQueryClient, REST_API_BASE_URL} from '@tanstack/react-query';
import {fetchAllCategories} from '../service/fetchPosts';
import {launchImageLibrary} from 'react-native-image-picker';

const AddBlog = item => {
  const readableItem = item.route.params;
  const {userInfo, logout, } = useContext(AuthContext);
  const [post, setPost] = useState(readableItem);
  const [categoryId, setCategoryId] = useState();
  const navigation = useNavigation();
  const client = useQueryClient();

  // QUERY AND STATES FOR FETCHING CATEGORIES
  const fetchAllCategories = async () => {
    const url = `${REST_API_BASE_URL}api/v1/categories`;

    const options = {
      method: 'GET',
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Faild to fetch Categories');
    }
    const json = await res.json();
    return json;
  };
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategories,
  });

  // Add image states and functions
  const [image, setImage] = useState(null);
  const [imageDetail, setImageDetails] = useState(null);
  const openImagePicker = async () => {
    const options = {
      title: 'Select Image',
      type: 'library',
      options: {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        selectionLimit: 1,
      },
    };

    const image = await launchImageLibrary(options);
    let imageUri = image.uri || image.assets?.[0]?.uri;

    if (image.didCancel === true) {
      setImage(null);
      setImageDetails(null);
    } else {
      setImage(imageUri);
      setImageDetails(image);
    }
  };

  useEffect(() => {
    if (readableItem) {
      console.log('----------> added update fields ');
      setCategoryId(readableItem.categoryId);
      const imgeUrl = `${REST_API_BASE_URL}/image/${readableItem.image}`;
      setImage(imgeUrl);
    }
  }, []);
  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };
  const ClearDataFromUI = () => {
    setImage(null);
    setImageDetails(null);
    setCategoryId(null);
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
      'Content-Type': 'multipart/form-data',
    },
  };

  const submitPost = (title, description, content) => {
    const formData = new FormData();
    const image = imageDetail;

    formData.append('file', {
      uri: image.assets?.[0]?.uri,
      type: image.assets?.[0]?.type,
      name: image.assets?.[0]?.fileName,
      fileName: image.assets?.[0]?.fileName,
    });

    const postDto = JSON.stringify({
      title: title,
      description: description,
      content: content,
      categoryId: categoryId,
    });

    formData.append('postDto', postDto);

    axios
      .post(`${REST_API_BASE_URL}/api/v1/posts`, formData, config)
      .then(res => {
        console.log(res);
        Refresh();
        ClearDataFromUI();
        navigation.navigate('Home');
      })
      .catch(e => {
        console.log(`error------------> ${e}`);

        // console.log(e.response.status);
        // if (e.response.status === 404) {
        //   pageNotFoundError();
        // }

        // if (e.response.status === 401) {
        //   tockenExpire();
        // }
      });
  };
  const updatePost = (title, description, content) => {
    console.log('Update method called');
    const ID = post.id;

    const formData = new FormData();
    const image = imageDetail;

    if (image != null) {
      formData.append('file', {
        uri: image.assets?.[0]?.uri,
        type: image.assets?.[0]?.type,
        name: image.assets?.[0]?.fileName,
        fileName: image.assets?.[0]?.fileName,
      });
    }
    // else {
    //   console.log('else block called');
    //   console.log(image);

    //   formData.append('file', new Blob(), '');
    // }

    const postDto = JSON.stringify({
      title: title,
      description: description,
      content: content,
      categoryId: categoryId,
    });

    formData.append('postDto', postDto);

    axios
      .put(`${REST_API_BASE_URL}/api/v1/posts/${ID}`, formData, config)
      .then(res => {
        console.log(res);
        Refresh();
        ClearDataFromUI();
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
      {/* // Handleing Image related thing below */}
      <View
        style={
          {
            // borderWidth: 1,
          }
        }>
        {image === null ? (
          // ADD Image button
          <TouchableOpacity
            onPress={openImagePicker}
            style={{
              borderWidth: 1,
              padding: moderateScale(5),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: moderateScale(5),
              marginBottom: moderateScale(10),
            }}>
            <Text>Add Image </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              // borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: image}}
              style={{
                width: '100%',
                height: 200,
                borderRadius: moderateScale(5),
                marginBottom: moderateScale(10),
                // resizeMode: 'contain',
              }}
            />
            <View
              style={{
                // borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginBottom: moderateScale(10),
                flexDirection: 'row',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={openImagePicker}
                style={{
                  borderWidth: 1,
                  padding: moderateScale(5),
                  borderRadius: moderateScale(5),
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '500',
                  }}>
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Remove Image',
                    'Are you sure you want to remove this image ??',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          setImage(null);
                          setImageDetails(null);
                        },
                      },
                    ],
                  );
                }}
                style={{
                  borderWidth: 1,
                  padding: moderateScale(5),
                  borderRadius: moderateScale(5),
                  backgroundColor: 'black',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '500',
                  }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
        onSubmit={(values, {resetForm}) => {
          post
            ? updatePost(values.title, values.description, values.content)
            : submitPost(values.title, values.description, values.content);
          resetForm({values: ''});
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
