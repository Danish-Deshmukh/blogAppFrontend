import {useContext, useState} from 'react';
import axios from 'axios';
import {useQueryClient} from '@tanstack/react-query';
import {Alert, ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import useErrors from './useErrors';

const useBookmark = (initialBookmarkState = false) => {
  const navigation = useNavigation();
  const {logout, userInfo, REST_API_BASE_URL} = useContext(AuthContext);
  const {serverError, pageNotFoundError, tockenExpire} = useErrors();
  const [isBookMark, setIsBookMark] = useState(initialBookmarkState);
  const [isBookMarkLoading, setIsBookMarkLoading] = useState(false);
  const queryClient = useQueryClient();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  };
  const addBookmark = async postId => {
    const body = {
      userId: userInfo.userId,
      postId: postId,
    };
    setIsBookMarkLoading(true);
    try {
      await axios.post(`${REST_API_BASE_URL}/bookmarks/add`, body, config);
      ToastAndroid.show('Post added in the bookmark', 1000);
      setIsBookMark(true);
      queryClient.invalidateQueries(['bookmarkedPosts']);
    } catch (e) {
      console.error(`Error adding bookmark: ${e}`);
      console.log(e.response.status);

      if (e.response.status >= 500) {
        serverError();
      }
      if (e.response.status === 404) {
        pageNotFoundError();
      }

      if (e.response.status === 401) {
        tockenExpire();
      }
    } finally {
      setIsBookMarkLoading(false);
    }
  };

  const removeBookmark = async postId => {
    setIsBookMarkLoading(true);
    try {
      const url = `${REST_API_BASE_URL}/bookmarks/remove?userId=${userInfo.userId}&postId=${postId}`;
      await axios.delete(url, config);
      setIsBookMark(false);
      ToastAndroid.show('Post remove from the bookmark', 1000);
      queryClient.invalidateQueries(['bookmarkedPosts']);
    } catch (e) {
      console.error(`Error removing bookmark: ${e}`);
      if (e.response.status >= 500) {
        serverError();
      }
      if (e.response.status === 404) {
        setIsBookMark(false);
      }
      if (e.response.status === 401) {
        tockenExpire();
      }
    } finally {
      setIsBookMarkLoading(false);
    }
  };

  return {
    isBookMark,
    setIsBookMark,
    addBookmark,
    removeBookmark,
    isBookMarkLoading,
  };
};

export default useBookmark;
