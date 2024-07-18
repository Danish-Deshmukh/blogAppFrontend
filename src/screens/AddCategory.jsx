import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Formik} from 'formik';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {object, string} from 'yup';
import Button from '../components/Button';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {pageNotFoundError} from '../CustomeError/Error';

const AddCategory = item => {
  const category = item.route.params;

  const {userInfo, logout, REST_API_BASE_URL} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState(false);
  const navigation = useNavigation();
  const client = useQueryClient();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const addCategory = (name, description) => {
    setIsLoading(true);
    console.log(name);
    console.log(description);
    console.log(REST_API_BASE_URL);

    axios
      .post(
        `${REST_API_BASE_URL}/categories`,
        {
          name,
          description,
        },
        config,
      )
      .then(res => {
        client.invalidateQueries(['homeCategories']);
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(e => {
        console.log(`register error hehehehehe ${e}`);
        console.log(e.response.message);
        setIsLoading(false);
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
  const updateCategory = (name, description) => {
    setIsLoading(true);
    console.log(name);
    console.log(description);
    console.log(REST_API_BASE_URL);

    axios
      .put(
        `${REST_API_BASE_URL}/categories/${category.id}`,
        {
          name,
          description,
        },
        config,
      )
      .then(res => {
        client.invalidateQueries(['homeCategories']);
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(e => {
        console.log(`register error hehehehehe ${e}`);
        console.log(e.response.message);
        setIsLoading(false);
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
  const deleteCategory = (name, description) => {
    setIsLoadingForDelete(true);
    console.log(name);
    console.log(description);
    console.log(REST_API_BASE_URL);

    axios
      .delete(`${REST_API_BASE_URL}/categories/${category.id}`, config)
      .then(res => {
        client.invalidateQueries(['homeCategories']);
        setIsLoadingForDelete(false);
        navigation.goBack();
      })
      .catch(e => {
        console.log(`register error hehehehehe ${e}`);
        console.log(e.response.message);
        setIsLoadingForDelete(false);
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

  let userSchema = object({
    name: string()
      .required('Please Enter Category Name')
      .max(25, 'Category Name should be less then 25 charactors'),
  });

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(40),
      }}>
      <View
        style={{
          // borderWidth: 1,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          // marginTop: moderateScale(-190),
          // margin: moderateScale(90),
        }}>
        {category ? (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: moderateScale(30),
            }}>
            Update Category
          </Text>
        ) : (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: moderateScale(30),
            }}>
            Add Category
          </Text>
        )}
      </View>
      <Formik
        validationSchema={userSchema}
        style={{
          height: '100%',
          borderWidth: 1,
        }}
        // initialValues={{
        //   name: '',
        //   description: '',
        // }}
        initialValues={
          category
            ? {
                name: category.name,
                description: category.description,
              }
            : {
                name: '',
                description: '',
              }
        }
        onSubmit={values => {
          category
            ? updateCategory(values.name, values.description)
            : addCategory(values.name, values.description);
        }}>
        {({handleChange, handleSubmit, values, errors}) => (
          <View>
            <TextInput
              style={{
                borderBottomWidth: 1,
                marginBottom: moderateScale(10),
              }}
              value={values.name}
              onChangeText={handleChange('name')}
              placeholder="Enter Name of the category here..."
            />
            {errors.name && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.name}
              </Text>
            )}

            <TextInput
              style={{
                borderBottomWidth: 1,
                marginBottom: moderateScale(10),
              }}
              value={values.description}
              onChangeText={handleChange('description')}
              multiline
              placeholder="Enter Description of the category here..."
            />

            {/* Add button and Loading  */}
            {isLoading ? (
              <View
                style={{
                  borderWidth: 1,
                  padding: moderateScale(5),
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderRadius: moderateScale(4),
                  marginVertical: moderateScale(20),
                }}>
                <ActivityIndicator size={'large'} color={'white'} />
              </View>
            ) : (
              //* ADD button */
              <Button
                onPress={handleSubmit}
                title={category ? 'Update' : 'Add'}
              />
            )}

            {category &&
              (isLoadingForDelete ? (
                <View
                  style={{
                    borderWidth: 1,
                    padding: moderateScale(5),
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    borderRadius: moderateScale(4),
                    marginVertical: moderateScale(20),
                  }}>
                  <ActivityIndicator size={'large'} color={'white'} />
                </View>
              ) : (
                <Button
                  onPress={() => {
                    Alert.alert(
                      'Delete Category',
                      'Are you sure you want to Delete this Category',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            deleteCategory();
                          },
                        },
                      ],
                    );
                  }}
                  title={'Delete'}
                />
              ))}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddCategory;

const styles = StyleSheet.create({});
