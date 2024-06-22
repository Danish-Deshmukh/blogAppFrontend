import axios from 'axios';
import {REST_API_BASE_URL} from './REST_API_BASE_URL';

// GETALL
export const listAllPost = () => {
  return axios.get(`${REST_API_BASE_URL}/posts?pageSize=5&pageNo=0&sortBy=id&sortDir=asc`);
};

// CREATE
export const createPost = post => {
  return axios.post(REST_API_BASE_URL, post);
};

// GETBYID
export const getPostById = id => axios.get(`${REST_API_BASE_URL}/posts/ ${id}`);

// UPDATE
export const updatePost = (id, post) =>
  axios.put(`${REST_API_BASE_URL}/posts/ ${id}`, post);

// DELETE
export const deletePost = id =>
  axios.delete(`${REST_API_BASE_URL}/posts/ ${id}`);
