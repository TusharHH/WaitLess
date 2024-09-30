import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/v1/admins';

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/login`, { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const signupAdmin = async (name, email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup`, { name, email, password });
    return response;
  } catch (error) {
    throw error;
  }
};
