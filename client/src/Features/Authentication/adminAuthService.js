import axios from 'axios';

const BACKEND_URL_ADMIN = 'http://localhost:4000/api/v1/admins';
const BACKEND_URL_USER = 'http://localhost:4000/api/v1/users'

const getToken = () => {
  const accessToken = localStorage.getItem("Token");
  // console.log(accessToken)
  return accessToken; // Adjust based on how you store the token
};

const getTokenForUser = () =>{
  const userToken = localStorage.getItem("authToken");
  // console.log(userToken);
  return userToken;
}
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

export const updateUserService = async (userId, formData) =>{
  try {
    const response = await axios.patch(`${BACKEND_URL_USER}/update_user/${userId}`,formData,{
      headers: {
          Authorization: `Bearer ${getTokenForUser()}`,  // Attach the token
          'Content-Type': 'multipart/form-data',  
      },
  });
    return response;
  } catch (error) {
    throw(error);
  }
};

export const updateAdminService = async (adminId,formData) =>{
  try {
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }    
    const response = await axios.patch(`${BACKEND_URL_ADMIN}/update-admin/${adminId}`,formData,{
      headers: {
          Authorization: `Bearer ${getToken()}`,  // Attach the token
          'Content-Type': 'multipart/form-data',  // Make sure the request is multipart
      },
  });
    return response;
  } catch (error) {
    throw(error);
  }
};
