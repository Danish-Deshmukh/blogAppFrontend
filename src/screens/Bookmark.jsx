import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {FlatList} from 'react-native-gesture-handler';
import Card from '../components/Card';
import {ActivityIndicator} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';

const Bookmark = () => {
  const {userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const client = useQueryClient();

  // QUERY FOR FETCHING POSTS BY User ID
  const fetchBookmarkedPosts = async () => {
    const url = `${REST_API_BASE_URL}/bookmarks/user/${userInfo.userId}`;

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('Faild to fetch Posts by this category');
    }
    const json = await res.json();
    return json;
  };
  const {
    data: bookmarkedPosts,
    error: bookmarkError,
    isLoading: bookmarkIsLoading,
  } = useQuery({
    queryKey: ['bookmarkedPosts'],
    queryFn: () => fetchBookmarkedPosts(),
  });

  useEffect(() => {
    // client.invalidateQueries(['bookmarkedPosts']);
    console.log('bookmark posts -------> ');
    console.log(bookmarkedPosts);
  }, [useIsFocused]);
  if (bookmarkIsLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color="black" />
      </View>
    );
  }

  if (bookmarkError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'red'}}>{bookmarkError.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {!Array.isArray(bookmarkedPosts) || bookmarkedPosts.length === 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: moderateScale(20),
          }}>
          <Ionicons
            name={'bookmarks-outline'}
            size={moderateScale(105)}
            color={'gray'}
          />
          <Text>No bookmarks</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedPosts}
          renderItem={({item}) => <Card item={item} />}
        />
      )}
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
