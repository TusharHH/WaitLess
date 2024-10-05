import axios from 'axios';

const BACKEND_URL_ADMIN = 'http://localhost:4000/api/v1/admins';
const BACKEND_URL_USER = 'http://localhost:4000/api/v1/users'

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL_ADMIN}/login`, { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const signupAdmin = async (formData) => {
  try {
    const response = await axios.post(`${BACKEND_URL_ADMIN}/signup`, formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email , password) => {
  try {
    const response = await axios.post(`${BACKEND_URL_USER}/login`,{email, password});
    return response;
  } catch (error) {
    throw(error)
  }
}

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL_USER}/signup`, { name, email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (name,email,password,id) =>{
  try {
    const response = await axios.put(`${BACKEND_URL_USER}/update_user,`,name,email,password,id);
    return response;
  } catch (error) {
    throw(error);
  }
};

export const updateAdmin = async (name,email,password,id) =>{
  try {
    const response = await axios.put(`${BACKEND_URL_ADMIN}/update_user,`,name,email,password,id);
    return response;
  } catch (error) {
    throw(error);
  }
};
