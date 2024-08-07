import {Modal, Pressable, StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import Card from '../components/Card';
import {useQuery} from '@tanstack/react-query';
import {moderateScale} from 'react-native-size-matters';
// Icons
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function FinalPrivewScreen() {
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
  const item = {title: 'this is title'};
  return (
    <View style={{
      flex: 1,
      // paddingHorizontal: moderateScale(10)
    }}>
      <Text>That's how your story card is going to look like </Text>

      <Card item={item} />

      {/* Category Select related container */}
      <View style={{
        paddingHorizontal: moderateScale(10)
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
          transparent={true}
          visible={showCategoryMenu}
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
                          color: categoryId === item.id ? 'white' : 'black',
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
    </View>
  );
}

const styles = StyleSheet.create({});
