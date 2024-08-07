import {
  Animated,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  ActivityIndicator,
  Button,
} from 'react-native';

import React, {useContext, useEffect, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {launchImageLibrary} from 'react-native-image-picker';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

const AddBlog = item => {
  const post = item.route.params;
  const {userInfo, logout, REST_API_BASE_URL} = useContext(AuthContext);

  const navigation = useNavigation();
  const client = useQueryClient();

  const scrollConst = verticalScale(50);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  const [postId, setPostId] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [categoryId, setCategoryId] = useState();
  const [category, setCategory] = useState(null);
  const [content, setContent] = useState('');
  const [showToolBar, setShowToolBar] = useState(false);
  const [forUpdate, setForUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  const [selection, setSelection] = useState({start: 0, end: 0});
  const insertText = (prefix, suffix = '') => {
    const start = content.slice(0, selection.start);
    const selectedText = content.slice(selection.start, selection.end);
    const end = content.slice(selection.end);
    setContent(`${start}${prefix}${selectedText}${suffix}${end}`);
  };

  const handleBold = () => {
    insertText('**', '**');
  };

  const handleItalic = () => {
    insertText('*', '*');
  };

  const handleHeading = () => {
    insertText('# ');
  };
  const handleList = () => {
    insertText('\n-  \n-  \n-  ');
  };
  const handleLink = () => {
    insertText('\n-  \n-  \n-  ');
  };
  const handleSubHeading = () => {
    insertText('## ');
  };
  const handleCode = () => {
    insertText('\n``` \n', '\n \n```\n');
  };

  // QUERY AND STATES FOR FETCHING CATEGORIES
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['homeCategories'],
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

  const Refresh = () => {
    // client.clear();
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };
  const ClearDataFromUI = () => {
    setImage(null);
    setImageDetails(null);
    setCategoryId(null);
  };
  let userSchema = Yup.object().shape({
    title: Yup.string()
      .required('Please Enter Title')
      .min(3, 'Title must be 3 or more charactors')
      .max(150, 'Title must be less then 150 charactors'),
    description: Yup.string()
      .required('Please Enter Description')
      .min(5, 'description should be 15 or more charactors')
      .max(250, 'Description must be less then 250 charactors'),
    content: Yup.string()
      .required('Please Enter Content')
      .min(10, 'content should not be less then 10 charactors'),
    categoryId: Yup.number().required('Please Select Category'),
  });

  const nextPage = async () => {
    // console.log('next called');
    // console.log(imageDetail);
    try {
      // console.log('inside the try block');
      // Awaiting for Yup to validate text
      await userSchema.validate(
        {title, description, content, categoryId},
        {abortEarly: false},
      );

      // Reseting Warnings and displaying success message if all goes well
      const post = {
        id: postId,
        title: title,
        description: description,
        content: content,
        categoryId: category.id,
        image: imageDetail,
        forUpdate: forUpdate,
      };

      // console.log(post);
      // console.log(post.category);
      // console.log(post.imageDetail);
      // console.log(imageDetail);
      navigation.navigate('PreviewScreen', post);

      setErrors({});
    } catch (error) {
      console.log('inside the catch block');
      // Reseting Succes Message

      // Setting error messages identified by Yup
      if (error instanceof Yup.ValidationError) {
        // Extracting Yup specific validation errors from list of total errors
        const yupErrors = {};
        error.inner.forEach(innerError => {
          yupErrors[innerError.path] = innerError.message;
        });

        // Saving extracted errors
        setErrors(yupErrors);
      }
    }
  };
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const getCategoryById = async () => {};

  // const submitPost = () => {
  //   console.log('title : ' + title);
  //   console.log('descriptiton : ' + description);
  //   console.log('content : ' + content);
  //   console.log('categoryId : ' + categoryId);

  //   console.log('submit button called');
  //   console.log(REST_API_BASE_URL);

  //   const formData = new FormData();
  //   const image = imageDetail;

  //   formData.append('file', {
  //     uri: image.assets?.[0]?.uri,
  //     type: image.assets?.[0]?.type,
  //     name: image.assets?.[0]?.fileName,
  //     fileName: image.assets?.[0]?.fileName,
  //   });

  //   const postDto = JSON.stringify({
  //     title: title,
  //     description: description,
  //     content: content,
  //     categoryId: categoryId,
  //   });

  //   formData.append('postDto', postDto);

  //   axios
  //     .post(`${REST_API_BASE_URL}/posts`, formData, config)
  //     .then(res => {
  //       console.log(res);
  //       Refresh();
  //       ClearDataFromUI();
  //       navigation.navigate('Home');
  //     })
  //     .catch(e => {
  //       console.log(`error------------> ${e}`);

  //       console.log(e.response.status);
  //       if (e.response.status === 404) {
  //         pageNotFoundError();
  //       }

  //       if (e.response.status === 401) {
  //         tockenExpire();
  //       }
  //     });
  // };
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
      .put(`${REST_API_BASE_URL}/posts/${ID}`, formData, config)
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

  useEffect(() => {
    if (post != null) {
      console.log(' update post useEffect called');
      console.log(post);
      setPostId(post.id);
      setTitle(post.title);
      setDescription(post.description);
      setContent(post.content);
      setCategoryId(post.categoryId);
      setForUpdate(true);
      getCategoryById();
      if (post.image != null) {
        const imgeUrl = `${REST_API_BASE_URL}/image/${post.image}`;
        setImageDetails(imgeUrl);
        setImage(imgeUrl);
      }
    }
  }, []);
  return (
    <>
      <Animated.View
        style={{
          transform: [{translateY: translateY}],
          height: verticalScale(50),
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          // borderWidth: 1,
        }}>
        {/* Header */}
        <View
          style={{
            borderBottomWidth: 0.2,
            flexDirection: 'row',
            elevation: 1,
            height: verticalScale(50),
            width: '100%',
            paddingLeft: moderateScale(8),
            backgroundColor: 'white',
          }}>
          <View style={styles.headTitleContainer}>
            {post ? (
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  // borderWidth: 1,
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  columnGap: moderateScale(10),
                  alignItems: 'center',
                }}>
                <FeatherIcons
                  name={'arrow-left'}
                  size={moderateScale(22)}
                  color="black"
                />
                <Text style={styles.headTitleText}>Back</Text>
              </Pressable>
            ) : (
              <View>
                <Text style={styles.headTitleText}>AddBlog</Text>
              </View>
            )}
          </View>

          {/* Template Button and Post or Update button */}

          <View
            style={{
              // borderWidth: 1,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: moderateScale(8),
            }}>
            {/* Template Button */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TemplateForMarkdown');
              }}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(5),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                backgroundColor: 'lightgreen',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Template
              </Text>
            </TouchableOpacity>

            {/* Done button */}
            <TouchableOpacity
              onPress={nextPage}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(5),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                backgroundColor: 'black',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Preview
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* ADD or Update blog container */}
      <View
        style={{
          flex: 1,
          padding: moderateScale(10),
        }}>
        {/* // If Edit tab is selected then show this */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}>
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(50)}} />

          <View>
            {/* // Handleing Image related thing below */}
            <View>
              {image == null ? (
                // ADD Image button
                <TouchableOpacity
                  onPress={openImagePicker}
                  style={{
                    borderWidth: 1,
                    height: moderateScale(40),
                    padding: moderateScale(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: moderateScale(5),
                    marginBottom: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: moderateScale(20),
                      fontWeight: 'bold',
                    }}>
                    Add Cover Image
                  </Text>
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

            {/* Category Select related container */}
            <View>
              {/* Create or Select category  */}
              <Pressable
                onPress={() => setShowCategoryMenu(true)}
                style={{
                  width: '100%',
                  height: moderateScale(35),
                  borderWidth: 1,
                  borderColor: errors.categoryId ? 'red' : 'black',
                  borderRadius: moderateScale(5),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: moderateScale(10),
                  marginBottom: moderateScale(10),
                }}>
                {category === null ? (
                  <Text># Select category</Text>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text># Selected category is : </Text>
                    <View
                      style={{
                        borderWidth: 0.8,
                        borderColor: 'black',
                        paddingVertical: moderateScale(4),
                        paddingHorizontal: moderateScale(10),
                        borderRadius: moderateScale(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: 'white',
                        }}>
                        {category.name}
                      </Text>
                    </View>
                  </View>
                )}
                <View
                  style={{
                    // borderWidth: 1,
                    height: moderateScale(30),
                    width: moderateScale(30),
                    borderRadius: moderateScale(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'white',
                  }}>
                  <MaterialCommunityIcons
                    name={'menu-down'}
                    size={moderateScale(29)}
                    color="black"
                  />
                </View>
              </Pressable>
              {/* Show Category Menu container */}
              <Modal
                isVisible={showCategoryMenu}
                transparent={true}
                // visible={showCategoryMenu}
                onBackdropPress={() => setShowCategoryMenu(false)}>
                <View
                  style={{
                    backgroundColor: 'white',
                    elevation: 20,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                  }}>
                  {/* Close Button */}
                  <View
                    style={{
                      // backgroundColor: 'blue',
                      height: moderateScale(40),
                      alignItems: 'flex-end',
                      // borderWidth: 1,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowCategoryMenu(false);
                      }}
                      style={{
                        // borderWidth: 1,
                        height: moderateScale(40),
                        width: moderateScale(40),
                        borderRadius: moderateScale(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <AntDesign
                        name={'close'}
                        size={moderateScale(25)}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Add Category Button */}
                  <Pressable
                    onPress={() => {
                      setShowCategoryMenu(false);
                      navigation.navigate('AddCategory');
                    }}
                    style={{
                      borderWidth: 0.5,
                      borderColor: 'green',
                      borderRadius: moderateScale(10),
                      height: moderateScale(35),
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                      gap: moderateScale(10),
                      paddingHorizontal: moderateScale(10),
                      marginHorizontal: moderateScale(10),
                    }}>
                    <Ionicons
                      name={'add-circle-outline'}
                      size={moderateScale(25)}
                      // color="black"
                    />

                    <Text
                      style={{
                        fontSize: moderateScale(15),
                        fontWeight: 'bold',
                        // color: 'black',
                      }}>
                      ADD New Category
                    </Text>
                  </Pressable>

                  {/* Select Category Option */}
                  <View
                    style={{
                      width: '100%',
                      height: '70%',
                    }}>
                    <View
                      style={{
                        padding: moderateScale(10),
                        // borderWidth: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: moderateScale(20),
                          fontWeight: 'bold',
                        }}>
                        Select Category
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          setEditCategory(!editCategory);
                          setCategory(null);
                          setCategoryId();
                        }}
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          padding: moderateScale(5),
                          paddingHorizontal: moderateScale(10),
                          borderRadius: moderateScale(10),
                          backgroundColor: editCategory ? 'lightgreen' : null,
                        }}>
                        <Text style={styles.commontSmallText}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      verticalScale={true}
                      numColumns={3}
                      alignSelf={'center'}
                      data={categories}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) =>
                        item.id === 1 ? null : (
                          <TouchableOpacity
                            onPress={() => {
                              if (editCategory) {
                                setShowCategoryMenu(false);
                                navigation.navigate('AddCategory', item);
                              } else {
                                id = item.id;
                                setCategoryId(id);
                                setCategory(item);
                                console.log('name : ' + item.name);
                                setShowCategoryMenu(false);
                              }
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
                            {editCategory && (
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: 'green',
                                  backgroundColor: 'green',
                                  height: moderateScale(10),
                                  width: moderateScale(10),
                                  borderRadius: moderateScale(5),
                                  position: 'absolute',
                                  right: 2,
                                  top: 2,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontWeight: '600',
                                color:
                                  categoryId === item.id ? 'white' : 'black',
                              }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )
                      }
                    />
                  </View>
                </View>
              </Modal>
              {errors.categoryId && (
                <Text style={styles.errorText}>{errors.categoryId}</Text>
              )}
            </View>

            <View>
              <View style={styles.CommonClearContainer}>
                <Text style={styles.titleText}>Title : </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Title',
                      'Are you sure you want to Clear Title data',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            setTitle('');
                          },
                        },
                      ],
                    );
                  }}
                  style={styles.CommonClearButton}>
                  <Text>Clear</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.titleText}
                value={title}
                onChangeText={setTitle}
                multiline
                placeholder="Enter title here..."
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}

              {/* Description */}
              <View style={styles.CommonClearContainer}>
                <Text style={styles.descriptionText}>Description : </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Description',
                      'Are you sure you want to Clear Description',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            setDescription('');
                          },
                        },
                      ],
                    );
                  }}
                  style={styles.CommonClearButton}>
                  <Text>Clear</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.descriptionText}
                value={description}
                onChangeText={setDescription}
                // onBlur={handleBlur('title')}
                multiline
                placeholder="Enter description here..."
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              {/* Content */}
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: moderateScale(10),
                  padding: moderateScale(5),
                  minHeight: moderateScale(500),
                }}>
                <View style={styles.CommonClearContainer}>
                  <Text style={styles.contentText}>Content : </Text>
                  {/* Clear button */}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Clear Content',
                        'Are you sure you want to Clear all the data in the Content',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              setContent('');
                            },
                          },
                        ],
                      );
                    }}
                    style={styles.CommonClearButton}>
                    <Text>Clear</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.contentText}
                  value={content}
                  onChangeText={setContent}
                  onSelectionChange={({nativeEvent: {selection, text}}) => {
                    setSelection(selection);
                    console.log(selection);
                    console.log(text);
                  }}
                  onBlur={() => {
                    setShowToolBar(false);
                  }}
                  onFocus={() => {
                    setShowToolBar(true);
                  }}
                  multiline
                  placeholder="Enter content here..."
                />
                {errors.content && (
                  <Text style={styles.errorText}>{errors.content}</Text>
                )}
              </View>
            </View>
          </View>
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(30)}} />
        </ScrollView>
      </View>
      {/* Toolbar for content */}
      {showToolBar && (
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={handleHeading}
            style={styles.toolbarButton}>
            <Text style={{color: 'black', fontSize: moderateScale(18)}}>
              H1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubHeading}
            style={styles.toolbarButton}>
            <Text style={{color: 'black'}}>H2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBold} style={styles.toolbarButton}>
            <FeatherIcons
              name={'bold'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleItalic} style={styles.toolbarButton}>
            <FeatherIcons
              name={'italic'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleList} style={styles.toolbarButton}>
            <FeatherIcons
              name={'list'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLink} style={styles.toolbarButton}>
            <FeatherIcons
              name={'link'}
              size={moderateScale(20)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCode} style={styles.toolbarButton}>
            <FeatherIcons
              name={'code'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCode} style={styles.toolbarButton}>
            <FeatherIcons
              name={'image'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default AddBlog;

const styles = StyleSheet.create({
  headTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headTitleText: {
    fontWeight: '600',
    fontSize: moderateScale(20),
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginBottom: moderateScale(20),
    marginTop: moderateScale(-10),
  },
  titleText: {
    // borderWidth: 0.5,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  contentText: {
    fontSize: moderateScale(15),
  },

  tabsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    padding: moderateScale(10),
    backgroundColor: 'white',
    elevation: 1,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'InterBold',
    fontWeight: 'bold',
  },
  commontSmallText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  commontMediumText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  commontLargeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  CommonClearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CommonClearButton: {
    borderWidth: 1,
    padding: moderateScale(3),
    borderRadius: moderateScale(3),
  },
  toolbar: {
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: moderateScale(30),
  },
  toolbarButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    // borderWidth: 1,
  },
});
