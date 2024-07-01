import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const fetchAllPosts = async pageParam => {
  const {REST_API_BASE_URL} = useContext(AuthContext);

  console.log("get all posts method is called ");
  console.log(REST_API_BASE_URL)

  let pageNO = pageParam.pageParam;

  const url = `${REST_API_BASE_URL}/posts?pageSize=10&pageNo=${pageNO}&sortBy=id&sortDir=desc`;

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

export const fetchPostById = async id => {
  // console.log('page param');
  // console.log(id);
  const url = `${REST_API_BASE_URL}/posts/${id}`;

  const options = {
    method: 'GET',
  };
  const res = await fetch(url, options);
  // console.log(res);
  if (!res.ok) {
    throw new Error(`Faild to fetch Post by ID = ${id}`);
  }
  const json = await res.json();
  // console.log(json)
  return json;
};

export const fetchAllCategories = async () => {
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

export const fetchPostsByCategory = async id => {
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
