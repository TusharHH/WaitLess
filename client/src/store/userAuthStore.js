import { create } from 'zustand';
import { loginUser, signupUser } from '../Features/Authentication/adminAuthService';

export const useUserAuthStore = create((set) => ({
  user: null,
  error: null,
  isLoading: false,
  isAuthenticated: false,

  // User Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser(email, password);
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      // Optionally store the user token in localStorage
      localStorage.setItem('authToken', response.data.data.user.authToken);
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
      set({
        user: response.data.newUser,
        isAuthenticated: true,
        isLoading: false,
      });
      // Optionally store the user token in localStorage
      localStorage.setItem('authToken', response.data.newUser.authToken);
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed!',
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Logout function
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('authToken');
  },

  // Check for existing authentication
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  // Reset error state
  resetError: () => {
    set({ error: null });
  },
}));

export default useUserAuthStore;
