import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  Image,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WhiteButton from '../components/WhiteButton';
import BlackButton from '../components/BlackButton';
import {launchImageLibrary} from 'react-native-image-picker';
import FitImage from 'react-native-fit-image';
import WhiteButtonLoading from '../components/WhiteButtonLoading';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';

// This is Add or Update content Screen
const AddContent = item => {
  const post = item.route.params;

  const navigation = useNavigation();
  const {userInfo, logout, REST_API_BASE_URL} = useContext(AuthContext);
  // console.log(userInfo)
  const scrollConst = verticalScale(50);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  const [errors, setErrors] = useState({});
  const [content, setContent] = useState('');
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [swapToolbar, setSwapToolbar] = useState(true);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const insertText = (prefix, suffix = '') => {
    const start = content.slice(0, selection.start);
    const selectedText = content.slice(selection.start, selection.end);
    const end = content.slice(selection.end);
    setContent(`${start}${prefix}${selectedText}${suffix}${end}`);
  };

  // If the post is for update then this useeffect going to work
  useEffect(() => {
    if (post != undefined) {
      console.log(post?.content);
      setContent(post.content);
      setIsForUpdate(true);
      const extractedImageUrls = post.imagesUrls.map(image => image.url);
      setImages(extractedImageUrls);
    }
  }, [post]);

  // Adding back handler
  // If your press back accidentaly then it will show alert
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }),
  );
  const backAction = () => {
    console.log('back method called ');
    if (content != '') {
      Alert.alert(
        'Hold on!',
        'If you press back, your content data in this page will be erased. Do you want to proceed?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'OK', onPress: () => navigation.goBack()},
        ],
      );
    } else {
      navigation.goBack();
    }
    return true;
  };

  const [selectLinkModel, setSelectLinkModel] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState(false);
  const handleLink = (text, link) => {
    if (text === undefined || text === '' || text === null) {
      text = 'Demo';
    }
    insertText(`[${text}](${link})`);
  };

  // Select Image
  const [selectImageModel, setSelectImageModel] = useState(false);
  const handleImages = item => {
    insertText(`![Image name](${item})`);
  };
  // Upload Image
  const [uploadImageModel, setUploadImageModel] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  // Add image states and functions
  const [image, setImage] = useState('');
  const [imageDetail, setImageDetails] = useState(null);
  const [images, setImages] = useState([]);
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
      setImage('');
      setImageDetails(null);
    } else {
      setImage(imageUri);
      setImageDetails(image);
    }
  };

  // This method was use for when we want to store images into the local server, but now it's not gonna work
  // const uploadImage = () => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${userInfo.accessToken}`,
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };

  //   setUploadImageLoading(true);

  //   if (imageDetail === null) {
  //     setUploadImageModel(false);
  //     setUploadImageLoading(false);
  //     ToastAndroid.show('You need to select image for upload', 1000);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri: imageDetail.assets?.[0]?.uri,
  //     type: imageDetail.assets?.[0]?.type,
  //     name: imageDetail.assets?.[0]?.fileName,
  //     fileName: imageDetail.assets?.[0]?.fileName,
  //   });

  //   axios
  //     .post(`${REST_API_BASE_URL}/uploadImage`, formData, config)
  //     .then(res => {
  //       console.log('Respone --> ', res.data);
  //       const imageUrl = `${REST_API_BASE_URL}/image/${res.data}`;
  //       setImages([...images, imageUrl]);
  //       setUploadImageLoading(false);
  //       setUploadImageModel(false);
  //     })
  //     .catch(e => {
  //       console.log('Error --> ', e);
  //       setUploadImageLoading(false);
  //       setUploadImageModel(false);

  //       if (e.response) {
  //         // Server-side error
  //         if (e.response.status === 404) {
  //           pageNotFoundError();
  //         } else if (e.response.status === 401) {
  //           tockenExpire();
  //         }
  //       } else if (e.request) {
  //         // Network error
  //         console.error('Network error: ', e.request);
  //       } else {
  //         // Something else
  //         console.error('Error: ', e.message);
  //       }
  //     });
  // };

  const API_KEY = '65ec53011a5c2b867880fd13292aaa64';
  const url = `https://api.imgbb.com/1/upload?key=${API_KEY}`;
  const uploadImagebb = async () => {
    setUploadImageLoading(true);

    if (imageDetail === null) {
      setUploadImageModel(false);
      setUploadImageLoading(false);
      ToastAndroid.show('You need to select image for upload', 1000);
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageDetail.assets?.[0]?.uri,
      type: imageDetail.assets?.[0]?.type,
      name: imageDetail.assets?.[0]?.fileName,
      fileName: imageDetail.assets?.[0]?.fileName,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const res = await response.json();
      // console.log(res);
      if (response.ok) {
        console.log('Response --> ', res);
        console.log('print the uri ', res.data.url);
        const imageUrl = res.data.url;
        // setImages([...images, imageUrl]);
        setImages(prevImages => [imageUrl, ...prevImages]);
        setUploadImageLoading(false);
        setUploadImageModel(false);
      } else {
        console.error('Upload failed:', res);
        setUploadImageLoading(false);
        setUploadImageModel(false);
        if (res.error) {
          console.error('Error:', res.error.message);
        }
      }
    } catch (e) {
      console.error('Error --> ', e);
      setUploadImageLoading(false);
      setUploadImageModel(false);
    }
  };
  let userSchema = Yup.object().shape({
    content: Yup.string().required('Content Should not be empty'),
  });
  const nextPage = async () => {
    try {
      await userSchema.validate({content}, {abortEarly: false});

      if (isForUpdate) {
        const postContent = {
          id: post.id,
          title: post.title,
          description: post.description,
          content: content,
          coverImage: post.coverImage,
          images: images,
          categoryId: post.categoryId,
          forUpdate: isForUpdate,
        };
        navigation.navigate('PreviewScreen', postContent);
      } else {
        const postContent = {
          content: content,
          images: images,
          forUpdate: isForUpdate,
        };
        navigation.navigate('PreviewScreen', postContent);
      }

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
            <View
              style={{
                // borderWidth: 1,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                columnGap: moderateScale(10),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  backAction(navigation);
                }}
                style={{
                  // borderWidth: 1,
                  borderRadius: moderateScale(20),
                  columnGap: moderateScale(10),
                  alignItems: 'center',
                }}>
                <FeatherIcons
                  name={'arrow-left'}
                  size={moderateScale(22)}
                  color="black"
                />
              </TouchableOpacity>

              <Text style={styles.headTitleText}>Back</Text>
            </View>
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

            {/* Add content button */}
            <TouchableOpacity
              onPress={nextPage}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(5),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                backgroundColor: 'black',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <View
        style={{
          flex: 1,
          padding: moderateScale(10),
          //   minHeight: moderateScale(500),
        }}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}>
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(50)}} />
          <View style={styles.CommonClearContainer}>
            {/* <Text style={styles.contentText}>Content : </Text> */}
            {/* Clear button */}
          </View>
          <TextInput
            style={styles.contentText}
            value={content}
            onChangeText={setContent}
            onSelectionChange={({nativeEvent: {selection, text}}) => {
              setSelection(selection);
              // console.log(selection);
              // console.log(text);
            }}
            // onBlur={handleBlur('title')}
            multiline
            placeholder="Enter content here..."
          />
          {errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(30)}} />
        </ScrollView>

        {/* Model for select images */}
        <Modal
          isVisible={selectImageModel}
          transparent={true}
          onBackButtonPress={() => setSelectImageModel(false)}
          onBackdropPress={() => setSelectImageModel(false)}>
          <View
            style={{
              flex: 1,
              width: '105%',
              alignSelf: 'center',
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
                  setSelectImageModel(false);
                }}
                style={{
                  // borderWidth: 1,
                  height: moderateScale(50),
                  width: moderateScale(50),
                  borderRadius: moderateScale(25),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign
                  name={'close'}
                  size={moderateScale(29)}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            {/* Add Image Button */}
            <Pressable
              onPress={() => {
                openImagePicker();
                setUploadImageModel(true);
              }}
              style={{
                borderWidth: 0.7,
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
              <Ionicons name={'image'} size={moderateScale(25)} />

              <Text
                style={{
                  fontSize: moderateScale(15),
                  fontWeight: 'bold',
                  // color: 'black',
                }}>
                ADD New Image
              </Text>
            </Pressable>

            {/* Select Image Options */}
            <View
              style={{
                width: '100%',
                height: '80%',
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
                  Select Image
                </Text>
              </View>

              {/* Images */}
              {images.length === 0 || images == undefined ? (
                // If the Images are not available
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name={'image-search'}
                    size={moderateScale(52)}
                  />
                  <Text>No image found</Text>
                </View>
              ) : (
                // If the Images are Available
                <FlatList
                  alignSelf={'center'}
                  data={images}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View
                      style={{
                        borderWidth: 0.3,
                        height: moderateScale(220),
                        width: moderateScale(310),
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                      }}>
                      <Image
                        source={{uri: item}}
                        style={{
                          width: '90%',
                          borderRadius: 5,
                          marginBottom: 10,
                          height: moderateScale(150),
                        }}
                      />

                      {/* Add and Delete buttons container  */}
                      <View
                        style={{
                          width: moderateScale(300),
                          height: moderateScale(30),
                          // borderWidth: 1,
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flexDirection: 'row',
                        }}>
                        {/* ADD button */}
                        <WhiteButton
                          title={'ADD'}
                          onPress={() => {
                            handleImages(item);
                            setSelectImageModel(false);
                          }}
                        />
                        {/* DELETE button */}
                        <BlackButton
                          title={'Delete'}
                          onPress={() => {
                            Alert.alert(
                              'Delete Warning !!!',
                              'If you delete this image from here then the image is not gonna work in your Post',
                              [
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: () => {},
                                },
                              ],
                            );
                          }}
                        />
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
          {/* Model for select Upload Images */}
          <Modal
            isVisible={uploadImageModel}
            transparent={true}
            // onBackButtonPress={() => setUploadImageModel(false)}
            // onBackdropPress={() => setUploadImageModel(false)}
          >
            <View
              style={{
                minHeight: '50%',
                width: '100%',
                alignSelf: 'center',
                backgroundColor: 'white',
                elevation: 20,
                paddingHorizontal: 10,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  minHeight: 180,
                  // borderWidth: 1,
                  borderRadius: 5,
                  // justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                {image === '' ? (
                  <View></View>
                ) : (
                  <Image
                    source={{uri: image}}
                    style={{
                      width: '90%',
                      height: moderateScale(150),
                    }}
                  />
                )}
              </View>
              {/* Upload and Cancel buttons container  */}
              <View
                style={{
                  width: moderateScale(300),
                  height: moderateScale(30),
                  // borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                }}>
                {/* ADD button */}
                {uploadImageLoading ? (
                  <WhiteButtonLoading />
                ) : (
                  <WhiteButton title={'Upload'} onPress={uploadImagebb} />
                )}
                {/* DELETE button */}
                <BlackButton
                  title={'Cancel'}
                  onPress={() => {
                    setUploadImageModel(false);
                    setImage('');
                    setImageDetails(null);
                    setUploadImageLoading(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </Modal>

        {/* Model for select Link */}
        <Modal
          isVisible={selectLinkModel}
          transparent={true}
          onBackButtonPress={() => setSelectLinkModel(false)}
          onBackdropPress={() => setSelectLinkModel(false)}>
          <View
            style={{
              height: moderateScale(250),
              width: '105%',
              alignSelf: 'center',
              backgroundColor: 'white',
              elevation: 20,
              paddingHorizontal: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Link text */}
            <View
              style={{
                width: '90%',
                height: moderateScale(40),
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 5,
              }}>
              <TextInput
                value={linkText}
                onChangeText={txt => setLinkText(txt)}
                placeholder="Enter text here"
              />
            </View>

            {/* Link  */}
            <View
              style={{
                width: '90%',
                height: moderateScale(40),
                borderWidth: 1,
                borderRadius: 5,
              }}>
              <TextInput
                value={link}
                onChangeText={txt => setLink(txt)}
                placeholder={
                  linkError
                    ? 'Link should not be empty'
                    : 'Paste your link here...'
                }
                placeholderTextColor={linkError && 'red'}
              />
            </View>
            <View
              style={{
                width: '90%',
                height: moderateScale(35),
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: moderateScale(20),
              }}>
              <WhiteButton
                title={'Add'}
                onPress={() => {
                  if (link === '') {
                    setLinkError(true);
                  } else {
                    handleLink(linkText, link);
                    setLinkError(false);
                    setLink('');
                    setLinkText('');
                    setSelectLinkModel(false);
                  }
                }}
              />
              <BlackButton
                title={'Cancel'}
                onPress={() => {
                  setLinkError(false);
                  setLink('');
                  setLinkText('');
                  setSelectLinkModel(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>

      {swapToolbar ? (
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              insertText('# ');
            }}
            style={styles.toolbarButton}>
            <Text style={{color: 'black', fontSize: moderateScale(18)}}>
              H1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('## ');
            }}
            style={styles.toolbarButton}>
            <Text style={{color: 'black'}}>H2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('**', '**');
            }}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'bold'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('*', '*');
            }}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'italic'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('\n-  \n-  \n-  ');
            }}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'list'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('\n1.  \n2.  \n3.  \n4.  ');
            }}
            style={styles.toolbarButton}>
            <MaterialCommunityIcons
              name={'format-list-numbered'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectLinkModel(true)}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'link'}
              size={moderateScale(20)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('\n``` \n', '\n \n```\n');
            }}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'code'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectImageModel(true)}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'image'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwapToolbar(!swapToolbar)}
            style={styles.toolbarButton}>
            <MaterialIcons
              name={'swap-vert'}
              size={moderateScale(25)}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              insertText('#');
            }}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'hash'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('*');
            }}
            style={styles.toolbarButton}>
            <FontAwesome6
              name={'star-of-life'}
              size={moderateScale(12)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('`');
            }}
            style={styles.toolbarButton}>
            <Text style={{fontSize: 30, color: 'black'}}>`</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText('[');
            }}
            style={styles.toolbarButton}>
            <Text style={{fontSize: 22, color: 'black'}}>[</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              insertText(']');
            }}
            style={styles.toolbarButton}>
            <Text style={{fontSize: 22, color: 'black'}}>]</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectImageModel(true)}
            style={styles.toolbarButton}>
            <FeatherIcons
              name={'image'}
              size={moderateScale(22)}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwapToolbar(!swapToolbar)}
            style={styles.toolbarButton}>
            <MaterialIcons
              name={'swap-vert'}
              size={moderateScale(25)}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default AddContent;

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
    marginBottom: 5,
  },
  toolbarButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(35),
    borderRadius: moderateScale(5),
  },
});
