import { create } from 'zustand';
import { loginUser, signupUser, updateUserService } from '../Features/Authentication/adminAuthService';

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  try {
      return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
      console.error("Error parsing stored user data:", error);
      // If data is invalid, remove it from localStorage
      localStorage.removeItem("user");
      return null;
  }
};

export const useUserAuthStore = create((set) => ({
  user: getStoredUser(),
  admins: [],
  error: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser(email, password);
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      // console.log(response.data.data.user)
      localStorage.setItem('authToken', response.data.data.user.authToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user)); 
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed!',
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  // User Registration function
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signupUser(name, email, password);
      // console.log(response.data.data.newUser)
      set({
        user: response.data.data.newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      // Store the token and user object in localStorage
      // console.log(response.data.data.newUser.authToken);
      localStorage.setItem('authToken', response.data.data.newUser.authToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.newUser)); // Store user object as a string
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed!',
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  // Logout function
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check for existing authentication
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user')); // Parse the stored user object
    if (token && user) {
      set({ isAuthenticated: true, user });
    } else {
      set({ isAuthenticated: false });
    }
  },

  // Reset error state
  resetError: () => {
    set({ error: null });
  },

  updateUser: async (userId,formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateUserService(userId,formData);
      // console.log("Hi")
      console.log(response.data.data.user);
      const updatedUser = response.data.data.user;
      set({
        user:updatedUser,
        isLoading:false,
      });
      console.log(updatedUser)
      localStorage.setItem('user',JSON.stringify(response.data.data.user));
      return true;
    } catch (error) {
      set({
        error:error.response?.data?.message || "user Update failed",
        isLoading:false,
      });
      return false;
    }
},


}));

export default useUserAuthStore;
