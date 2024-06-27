import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native-paper';
import {
  fetchAllCategories,
  fetchAllPosts,
  fetchPostsByCategory,
} from '../service/fetchPosts';
import Card from '../components/Card';
import {moderateScale} from 'react-native-size-matters';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';

export default function Home() {
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

  // QUERY FOR FETCHING POSTS
  const {data, isLoading, error, fetchNextPage, isFetchingNextPage} =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: fetchAllPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => pages.length,
    });
  const posts = data?.pages.flat();

  // QUERY AND STATES FOR FETCHING CATEGORIES
  const [selectedCategories, setSelectedCategories] = useState(1);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategories,
  });

  // QUERY FOR FETCHING POSTS BY CATEGORY
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

        {/* REFRESH BUTTON */}
        <TouchableOpacity
          onPress={() => {
            Refresh();
            console.log('refresh called');
          }}
          style={{
            marginRight: moderateScale(10),
          }}>
          <FoundationIcon
            name={'refresh'}
            size={moderateScale(30)}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* CATEGORYS */}
      <View
        style={{
          minHeight: moderateScale(40),
          width: '100%',
          // borderWidth: 1,
        }}>
        {categoriesIsLoading && (
          <ActivityIndicator
            color={'black'}
            style={{
              position: 'absolute',
              zIndex: 1,
              alignSelf: 'center',
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
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Under Construction',
                    'This Feature is under construnction',
                    [
                      {
                        text: 'OK',
                      },
                    ],
                  );
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
                  backgroundColor: 'white',
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: 'black',
                  }}>
                  more...
                </Text>
              </TouchableOpacity>
            )}
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

      {/* ALLPosts */}
      <View
        style={{
          marginBottom: moderateScale(90),
        }}>
        {isLoading && (
          <ActivityIndicator
            color={'black'}
            size={'large'}
            style={{
              position: 'absolute',
              alignSelf: 'center',
              // top: 'auto',
            }}
          />
        )}
        {error ? (
          <View>
            <Text style={styles.ErrorMessageText}>{error.message}</Text>
          </View>
        ) : selectedCategories === 1 ? (
          // SHOW ALL POSTS WITH PAGINATION
          <FlatList
            ref={ref}
            data={posts}
            renderItem={({item}) => <Card item={item} />}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              fetchNextPage();
            }}
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
            data={postByCategory}
            renderItem={({item}) => <Card item={item} />}
          />
        )}
      </View>
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
    elevation: 10,
  },
  ErrorMessageText: {
    color: 'red',
    alignSelf: 'center',
  },
});
