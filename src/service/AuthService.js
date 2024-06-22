import axios from 'axios';
import {REST_API_BASE_URL} from './REST_API_BASE_URL';

// Login
export const login = userData => {
  return axios.post(`${REST_API_BASE_URL}/auth`, userData);
};
