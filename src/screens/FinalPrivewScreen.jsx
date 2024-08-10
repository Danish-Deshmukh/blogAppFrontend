import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useContext, useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {moderateScale, verticalScale} from 'react-native-size-matters';

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import BlackButton from '../components/BlackButton';
import * as Yup from 'yup';
import axios from 'axios';
import WhiteButtonLoading from '../components/WhiteButtonLoading';
import BlackButtonLoading from '../components/BlackButtonLoading';
export default function FinalPrivewScreen(item) {
  const post = item.route.params;
  const content = post.content;
  // console.log('___________________');
  // console.log(post);
  const navigation = useNavigation();
  const client = useQueryClient();
  const {userInfo, logout, REST_API_BASE_URL} = useContext(AuthContext);
  // QUERY AND STATES FOR FETCHING CATEGORIES
  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState();
  const [errors, setErrors] = useState({});
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['homeCategories'],
  });

  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState('');

  const [description, setDescription] = useState('');
  const [descriptionEdited, setDescriptionEdited] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlEdited, setImageUrlEdited] = useState('');

  const [imagesUrls, setImagesUrls] = useState([]);
  console.log(imagesUrls);
  console.log(imagesUrls.url);
  const [imagesFromContent, setImagesFromContent] = useState([]);
  const imagesFormPost = post.images;
  useEffect(() => {
    mergeImageUrls();
  }, [imagesFromContent, imagesFormPost]);
  const mergeImageUrls = () => {
    const mergedImages = [...imagesFromContent, ...imagesFormPost];
    const uniqueImages = Array.from(new Set(mergedImages)); // Remove duplicates

    // converting image array into image Object
    const imageObject = uniqueImages.map(url => ({
      id: null,
      url: url,
    }));
    setImagesUrls(imageObject);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showEditImageMenu, setShowEditImageMenu] = useState(false);
  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postDetail']);
  };
  useEffect(() => {
    const titleText = extractTitleOrText(content);
    if (titleEdited === '') {
      setTitle(titleText);
    }
    const descText = extractDescOrText(content);
    if (descriptionEdited === '' && titleText != descText) {
      setDescription(descText);
    }
    const url = extractImageUrl(content);
    if (imageUrlEdited === '') {
      setImageUrl(url);
    }

    // Extracting all Images Url from content
    const extractedUrls = extractAllImageUrls(content);
    setImagesFromContent(extractedUrls);
  }, []);

  const extractTitleOrText = markdown => {
    const headingMatch = markdown.match(/^# (.+)$/m);
    const subheadingMatch = markdown.match(/^## (.+)$/m);
    const plainTextMatch = markdown.match(/^(?!\!\[.*\]\(.*\)).+$/m);

    if (headingMatch) {
      return headingMatch[1].trim();
    } else if (subheadingMatch) {
      return subheadingMatch[1].trim();
    } else if (plainTextMatch) {
      return plainTextMatch[0].trim();
    } else {
      return '';
    }
  };
  const extractDescOrText = markdown => {
    const subheadingMatch = markdown.match(/^## (.+)$/m);
    // This regex looks for any line that is not a heading, subheading, or image markdown pattern
    const plainTextMatch = markdown.match(
      /^(?!\s*#(?!#)|\s*!\[.*\]\(.*\)).+$/m,
    );

    if (subheadingMatch) {
      return subheadingMatch[1].trim();
    } else if (plainTextMatch) {
      return plainTextMatch[0].trim();
    } else {
      return '';
    }
  };
  const extractImageUrl = markdown => {
    const imageMatch = markdown.match(/!\[.*\]\((.*)\)/);

    if (imageMatch) {
      return imageMatch[1].trim();
    } else {
      // https://i.ibb.co/2kTT8Sf/1000000039.jpg
      return '';
    }
  };
  const extractAllImageUrls = markdown => {
    const imageUrlPattern = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
    const matches = [];
    let match;

    while ((match = imageUrlPattern.exec(markdown)) !== null) {
      matches.push(match[1]); // Push the captured URL into the array
    }

    return matches;
  };

  let userSchema = Yup.object().shape({
    categoryId: Yup.number().required('Please Select Category'),
  });

  const validateing = async () => {
    try {
      await userSchema.validate({categoryId}, {abortEarly: false});

      console.log('post Validated');

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
    },
  };
  const [submitPostLoading, setSubmitPostLoading] = useState(false);
  const createPost = () => {
    validateing();
    setSubmitPostLoading(true);

    const titleSend = titleEdited != '' ? titleEdited : title;
    const descriptionSend =
      descriptionEdited != '' ? descriptionEdited : description;
    const contentSend = content;
    const categoryIdSend = categoryId;
    const coverImageSend = imageUrlEdited != '' ? imageUrlEdited : imageUrl;
    const imagesUrlsSend = imagesUrls;

    console.log('images urls ');
    console.log(coverImageSend);
    console.log(imagesUrls);

    const postSend = {
      title: titleSend,
      description: descriptionSend,
      content: contentSend,
      categoryId: categoryIdSend,
      coverImage: coverImageSend,
      imagesUrls: imagesUrlsSend,
    };
    console.log('++++++++++++++++++++++');
    console.log(postSend.title);
    console.log(postSend.description);
    console.log(postSend.content);
    console.log(postSend.categoryId);
    console.log(postSend.coverImage);
    console.log(postSend.imagesUrls);

    axios
      .post(`${REST_API_BASE_URL}/posts`, postSend, config)
      .then(res => {
        console.log(res);
        Refresh();
        navigation.navigate('Home');
        setSubmitPostLoading(false);
      })
      .catch(e => {
        console.log(`error------------> ${e}`);
        console.log(e.response.status);
        setSubmitPostLoading(false);
        if (e.response.status === 404) {
          pageNotFoundError();
        }

        if (e.response.status === 401) {
          tockenExpire();
        }
      });
    setSubmitPostLoading(false);
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
    <View
      style={{
        flex: 1,
        paddingHorizontal: moderateScale(5),
      }}>
      <View style={{padding: moderateScale(10)}}>
        <Text
          style={{
            color: 'black',
            fontWeight: '400',
          }}>
          That's how your card is going to look like in the Home page
        </Text>
      </View>

      {/* // Card  */}
      <View
        style={{
          margin: moderateScale(5),
          borderRadius: moderateScale(5),
          height: verticalScale(160),
          elevation: 5,
          // borderWidth: 1,
          backgroundColor: 'white',
          flexDirection: 'row',
        }}>
        {/* Title and desc container */}
        <View
          style={{
            // borderWidth: 1,
            paddingVertical: 20,
            width: '70%',
            height: '90%',
            padding: moderateScale(5),
            paddingHorizontal: moderateScale(15),
            justifyContent: 'center',
            // alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View style={{maxHeight: moderateScale(100)}}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.text,
                  styles.titleText,
                  {borderWidth: 1, borderRadius: 5, borderColor: 'lightgreen'},
                ]}
                multiline
                placeholder={titleEdited != '' ? titleEdited : title}
                value={titleEdited}
                onChangeText={txt => setTitleEdited(txt)}
              />
            ) : (
              <Text style={[styles.text, styles.titleText]} numberOfLines={3}>
                {titleEdited != '' ? titleEdited : title}
              </Text>
            )}
          </View>
          <View style={{maxHeight: moderateScale(50)}}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.text,
                  styles.descText,
                  {borderWidth: 1, borderRadius: 5, borderColor: 'lightgreen'},
                ]}
                multiline
                placeholder={
                  descriptionEdited != '' ? descriptionEdited : description
                }
                value={descriptionEdited}
                onChangeText={txt => setDescriptionEdited(txt)}
              />
            ) : (
              <Text style={[styles.text, styles.descText]} numberOfLines={1}>
                {descriptionEdited != '' ? descriptionEdited : description}
              </Text>
            )}
          </View>
        </View>

        {/* Image  */}
        <View
          style={{
            // borderWidth: 1,
            width: '30%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isEditing ? (
            <TouchableOpacity
              onPress={() => setShowEditImageMenu(true)}
              style={{
                height: '30%',
                width: '90%',
                borderWidth: 3,
                borderColor: 'lightgreen',
              }}>
              {(imageUrl != '' || imageUrlEdited != '') && (
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: moderateScale(2),
                  }}
                  source={{
                    uri: imageUrlEdited === '' ? imageUrl : imageUrlEdited,
                  }}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View style={{height: '30%', width: '90%'}}>
              {(imageUrl != '' || imageUrlEdited != '') && (
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: moderateScale(2),
                  }}
                  source={{
                    uri: imageUrlEdited === '' ? imageUrl : imageUrlEdited,
                  }}
                />
              )}
            </View>
          )}
        </View>

        {/* // Edit Button */}
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={{
            borderWidth: 0.5,
            borderRadius: moderateScale(10),
            borderColor: isEditing ? 'pink' : 'green',
            padding: moderateScale(5),
            paddingHorizontal: moderateScale(10),
            position: 'absolute',
            right: moderateScale(10),
            top: moderateScale(10),
          }}>
          {isEditing ? (
            <Text
              style={{
                color: 'black',
                fontSize: moderateScale(14),
              }}>
              Done
            </Text>
          ) : (
            <Text
              style={{
                color: 'black',
                fontSize: moderateScale(14),
              }}>
              Edit
            </Text>
          )}
        </TouchableOpacity>

        {/* Show Images for selecting model */}
        <Modal
          isVisible={showEditImageMenu}
          visible={showEditImageMenu}
          onBackdropPress={() => setShowEditImageMenu(false)}
          onBackButtonPress={() => {
            setShowEditImageMenu(false);
          }}>
          <View
            style={{
              backgroundColor: 'white',
              elevation: 20,
              paddingHorizontal: 15,
              borderRadius: 20,
              flex: 0.5,
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
                  setShowEditImageMenu(false);
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

            {/* image items */}
            <View
              style={{
                // borderWidth: 1,
                // maxHeight: '70%',
                height: '70%',
                // marginTop: 20,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: moderateScale(20),
                  fontWeight: '500',
                }}>
                Uploaded Images
              </Text>

              {imagesUrls.length === 0 || imagesUrls == undefined ? (
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
                <FlatList
                  data={imagesUrls}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3} // Adjust number of columns as needed
                  contentContainerStyle={{
                    padding: 10,
                    justifyContent: 'center',
                  }}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        setImageUrl('');
                        setImageUrlEdited(item.url); // Use item.url instead of item
                        setShowEditImageMenu(false);
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 5,
                      }}>
                      {(item.url === imageUrl ||
                        item.url === imageUrlEdited) && (
                        <View
                          style={{
                            backgroundColor: 'black',
                            opacity: 0.4,
                            width: moderateScale(70),
                            height: moderateScale(50),
                            position: 'absolute',
                            zIndex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: 'white'}}>Selected</Text>
                        </View>
                      )}

                      <Image
                        source={{uri: item.url}} // Use item.url instead of item
                        style={{
                          width: moderateScale(70),
                          height: moderateScale(50),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>

      <View style={{padding: moderateScale(10)}}>
        <Text
          style={{
            color: 'black',
            fontSize: moderateScale(25),
            fontWeight: '500',
          }}>
          Category
        </Text>
      </View>
      {/* Category Select related container */}
      <View
        style={{
          paddingHorizontal: moderateScale(10),
        }}>
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
          visible={showCategoryMenu}
          onBackdropPress={() => setShowCategoryMenu(false)}
          onBackButtonPress={() => {
            setShowCategoryMenu(false);
          }}>
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

              {categoriesIsLoading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <ActivityIndicator color={'black'} />
                </View>
              ) : categoriesError ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text style={{color: 'red'}}>
                    {categoriesError.message} !!!
                  </Text>
                </View>
              ) : (
                // Show category options
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
                            setEditCategory(false);
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
                            color: categoryId === item.id ? 'white' : 'black',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                />
              )}
            </View>
          </View>
        </Modal>
        {errors.categoryId && (
          <Text style={styles.errorText}>{errors.categoryId}</Text>
        )}
      </View>

      {/* Post Button */}
      <View
        style={{
          // borderWidth: 1,
          width: '200%',
          height: moderateScale(35),
          margin: moderateScale(20),
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        {submitPostLoading ? (
          <BlackButtonLoading />
        ) : (
          <BlackButton title={'Post'} onPress={createPost} />
        )}
      </View>
    </View>
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
  errorText: {
    color: 'red',
    marginBottom: moderateScale(20),
    marginTop: moderateScale(-10),
  },
});
