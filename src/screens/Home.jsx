import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native-paper';
import Card from '../components/Card';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';

// Icons
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {
  useFocusEffect,
  useNavigation,
  useScrollToTop,
} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export default function Home() {
  const {isAdmin, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const navigation = useNavigation();

  const [showMenuModel, setShowMenuModel] = useState(false);
  const scrollConst = moderateScale(100);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  // Below ref is for When click on Home button then it will take you to top of the scrollable screen
  const ref = useRef(null);
  useScrollToTop(ref);

  const [exitApp, setExitApp] = useState(0);
  const backAction = () => {
    // THIS FUNCTION IS TO PRESS BACK TWO TIMES TO EXIT THE APP
    setTimeout(() => {
      setExitApp(0);
    }, 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      ToastAndroid.show('Tap back once more to exit', 1000);
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }),
  );

  const client = useQueryClient();

  console.log(userInfo.userId);
  // QUERY FOR FETCHING POSTS
  const fetchAllPosts = async pageParam => {
    console.log('get all posts method is called ');
    console.log(REST_API_BASE_URL);

    let pageNO = pageParam.pageParam;
    const userId = userInfo.userId === undefined ? 0 : userInfo.userId;

    const url = `${REST_API_BASE_URL}/posts?userId=${userId}&pageSize=10&pageNo=${pageNO}&sortBy=id&sortDir=desc`;

    const options = {
      method: 'GET',
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('not able to fetch Posts');
    }
    const json = await res.json();

    return json.content;
  };

  const {
    data,
    isLoading: postLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => pages.length,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const posts = data?.pages.flat();

  // QUERY AND STATES FOR FETCHING CATEGORIES
  const fetchAllCategories = async () => {
    const url = `${REST_API_BASE_URL}/categories`;

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
  const [selectedCategories, setSelectedCategories] = useState(1);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: fetchAllCategories,
  });

  // QUERY FOR FETCHING POSTS BY CATEGORY
  const fetchPostsByCategory = async id => {
    const url = `${REST_API_BASE_URL}/categories/category/${id}`;

    const options = {
      method: 'GET',
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Faild to fetch Posts by this category');
    }
    const json = await res.json();
    return json;
  };
  const {data: postByCategory} = useQuery({
    queryKey: ['postByCategory'],
    queryFn: () => fetchPostsByCategory(selectedCategories),
  });

  const Refresh = () => {
    client.invalidateQueries(['posts']);
    client.invalidateQueries(['postByCategory']);
  };
  useEffect(() => {
    client.invalidateQueries(['postByCategory']);
  }, [selectedCategories]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{translateY: translateY}],
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          elevation: 4,
          zIndex: 1,
        }}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // borderWidth: 1,
              width: moderateScale(90),
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: moderateScale(20),
                color: 'black',
              }}>
              Blog App
            </Text>
          </View>

          {/* Three Dots menu Button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              // borderWidth: 1,
              width: '40%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowMenuModel(true);
              }}>
              <Feather
                name={'more-vertical'}
                size={moderateScale(22)}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {/* Three Dots menu Model*/}
          <Modal
            isVisible={showMenuModel}
            onBackdropPress={() => setShowMenuModel(false)}
            animationIn={'fadeInRight'}
            animationOut={'fadeOutRight'}
            backdropOpacity={0}>
            <View
              style={{
                minHeight: moderateScale(100),
                width: moderateScale(140),
                position: 'absolute',
                top: -10,
                right: -10,
                backgroundColor: '#FFFFFF',
                borderRadius: moderateScale(5),
                elevation: 10,
              }}>
              {/* REFRESH BUTTON */}
              <TouchableOpacity
                onPress={() => {
                  setShowMenuModel(false);
                  Refresh();
                }}
                style={{
                  width: '100%',
                  height: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
                  Refresh
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View
                style={{
                  backgroundColor: 'gray',
                  width: '90%',
                  height: 1,
                  alignSelf: 'center',
                }}
              />

              {/* ADD URL Button here */}
              <TouchableOpacity
                onPress={() => {
                  setShowMenuModel(false);
                  navigation.navigate('AddUrlScreen');
                }}
                style={{
                  width: '100%',
                  height: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // borderRadius: moderateScale(10),
                }}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
                  Add url
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        {/* CATEGORYS */}
        <View
          style={{
            minHeight: moderateScale(40),
            width: '100%',
            // borderWidth: 1,
            backgroundColor: 'white',
          }}>
          {categoriesIsLoading && (
            // Loading Category skeleton
            <FlatList
              scrollEnabled={false}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[1, 1, 1, 1, 1, 1]}
              renderItem={() => {
                return (
                  <View
                    style={{
                      height: moderateScale(30),
                      width: moderateScale(70),
                      borderWidth: 0.1,
                      // elevation: 1,
                      borderColor: 'black',
                      paddingVertical: moderateScale(6),
                      paddingHorizontal: moderateScale(15),
                      margin: moderateScale(4),
                      marginTop: moderateScale(9),
                      borderRadius: moderateScale(10),
                    }}
                  />
                );
              }}
            />
          )}
          {categoriesError ? (
            <View>
              <Text style={styles.ErrorMessageText}>
                {categoriesError.message}
              </Text>
            </View>
          ) : (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={categories}
              // ListHeaderComponent={() => (
              //   <TouchableOpacity
              //     onPress={() => {
              //       navigation.navigate('AddCategory');
              //       // Alert.alert(
              //       //   'Under Construction',
              //       //   'This Feature is under construnction',
              //       //   [
              //       //     {
              //       //       text: 'OK',
              //       //     },
              //       //   ],
              //       // );
              //     }}
              //     style={{
              //       borderWidth: 0.8,
              //       borderColor: 'black',
              //       paddingVertical: moderateScale(6),
              //       paddingHorizontal: moderateScale(10),
              //       margin: moderateScale(4),
              //       marginTop: moderateScale(9),
              //       borderRadius: moderateScale(10),
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       backgroundColor: 'white',
              //       flexDirection: 'row',
              //     }}>
              //     <Ionicons
              //       name={'add'}
              //       size={moderateScale(19)}
              //       color="black"
              //     />
              //     <Text
              //       style={{
              //         fontWeight: '600',
              //         color: 'black',
              //       }}>
              //       ADD
              //     </Text>
              //   </TouchableOpacity>
              // )}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    id = item.id;
                    setSelectedCategories(id);
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
                      selectedCategories === item.id ? 'black' : 'white',
                  }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: selectedCategories === item.id ? 'white' : 'black',
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Animated.View>
      {postLoading && (
        // Skeleton Loading for Post Card
        <View
          style={{
            height: '100%',
            width: '100%',
          }}>
          <FlatList
            scrollEnabled={false}
            data={[1, 1, 1, 1, 1]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              // Below View is for adjusting with the heading height when scrolling
              <View style={{height: moderateScale(100)}} />
            )}
            renderItem={() => {
              return (
                <View
                  style={{
                    margin: moderateScale(5),
                    borderRadius: moderateScale(5),
                    height: verticalScale(160),
                    elevation: 2,
                    flexDirection: 'row',
                    backgroundColor: 'white',
                  }}>
                  <View
                    style={{
                      // borderWidth: 1,
                      width: '70%',
                      padding: moderateScale(5),
                      paddingHorizontal: moderateScale(15),
                      justifyContent: 'center',
                    }}>
                    <View style={styles.skeletonCardTestShadow} />
                    <View style={styles.skeletonCardTestShadow} />
                    <View style={styles.skeletonCardTestShadow} />
                  </View>
                  <View
                    style={{
                      // borderWidth: 1,
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={styles.skeletonCardImageShadow} />
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
      {/* ALLPosts */}
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {error ? (
          <View>
            <Text style={styles.ErrorMessageText}>{error.message}</Text>
          </View>
        ) : selectedCategories === 1 ? (
          // SHOW ALL POSTS WITH PAGINATION
          <FlatList
            ref={ref}
            data={posts}
            showsVerticalScrollIndicator={false}
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
            renderItem={({item}) => <Card item={item} />}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              fetchNextPage();
            }}
            ListHeaderComponent={() => (
              // Below View is for adjusting with the heading height when scrolling
              <View style={{height: moderateScale(100)}} />
            )}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    width: '90%',
                    height: moderateScale(60),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {isFetchingNextPage && <ActivityIndicator color={'black'} />}
                </View>
              );
            }}
          />
        ) : (
          <FlatList
            ref={ref}
            data={postByCategory}
            renderItem={({item}) => <Card item={item} />}
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
            ListHeaderComponent={() => (
              // Below View is for adjusting with the heading height when scrolling
              <View
                style={{
                  // borderWidth: 1,
                  height: moderateScale(100),
                }}
              />
            )}
          />
        )}
      </View>

      {/* AddBlog Button for only Admin */}
      {isAdmin && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddContent');
          }}
          style={{
            position: 'absolute',
            height: 60,
            width: 60,
            borderRadius: 30,
            bottom: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 10,
            backgroundColor: 'black',
          }}>
          <FontAwesome
            name={'pencil-square-o'}
            size={moderateScale(22)}
            color="white"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    height: moderateScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    elevation: 1,
    borderBottomWidth: 0.2,
  },
  ErrorMessageText: {
    color: 'red',
    alignSelf: 'center',
  },
  skeletonCardTestShadow: {
    borderWidth: 0.1,
    height: 30,
    marginBottom: 10,
    borderRadius: 10,
    // elevation: 1,
  },
  skeletonCardImageShadow: {
    width: '90%',
    height: '30%',
    borderRadius: moderateScale(2),
    borderWidth: 0.1,
    // elevation: 1,
  },
});
