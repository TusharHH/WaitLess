import { create } from 'zustand';
import { loginAdmin, signupAdmin, updateAdmin } from '../Features/Authentication/adminAuthService';
import axios from 'axios';

const getStoredUser = () => {
    const storedUser = localStorage.getItem("admin");
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing stored user data:", error);
        // If data is invalid, remove it from localStorage
        localStorage.removeItem("user");
        return null;
    }
};

const useAdminStore = create((set) => ({
    admins:[],
    admin: getStoredUser(),
    token: null,
    error: null,
    isLoading: false,

    clearError: () => set(() => ({ error: null })),

    setError: (e) => set(() => ({ error: e })),

    login: async (email, password) => {
        set(() => ({ isLoading: true }));

        try {
            const response = await loginAdmin(email, password);

            if (response.success === false) {
                set(() => ({ error: response.message, isLoading: false }));
                return false;
            }

            const authAdmin = response.data.data.adminDetails;
            const token = response.data.data.Token;  // Capture the token

            if (!authAdmin || !token) {
                set(() => ({ error: 'Something went wrong!', isLoading: false }));
                return false;
            }

            set(() => ({ admin: authAdmin, token, isLoading: false }));
            localStorage.setItem('admin', JSON.stringify(authAdmin));
            localStorage.setItem('token', token);  // Store the token

            return true;

        } catch (error) {
            set(() => ({ error: error.message, isLoading: false }));
            return false;
        }
    },

    signup: async (formData) => {
        set(() => ({ isLoading: true, error: null }));

        try {
            const response = await signupAdmin(formData);
            const authAdmin = response.data.data.newAdmin;
            const token = response.data.data.newAdmin.authToken;
            console.log(response.data.data.newAdmin);
            console.log(token);
            // Capture the token
            // if (!authAdmin || !token) {
            //     set(() => ({ error: 'Something went wrong!', isLoading: false }));
            //     return false;
            // }
            set({
                admin: authAdmin,
                error: null,
                isLoading: false,
                token: token,
            });

            // set(() => ({ admin: authAdmin, token, isLoading: false }));
            localStorage.setItem('admin', JSON.stringify(authAdmin));
            localStorage.setItem('token', token);  // Store the token
            return true;

        } catch (error) {
            // Handling specific cases like 409 Conflict
            if (error.response?.status === 409) {
                set(() => ({ error: 'Admin with this email already exists', isLoading: false }));
            } else {
                set(() => ({ error: error.message || 'An error occurred', isLoading: false }));
            }
            return false;
        }
    },

    logout: () => {
        set(() => ({ admin: null, token: null }));
        localStorage.removeItem('admin');
        localStorage.removeItem('token');   
    },
    getUsers: async (serviceId) => {
        try {
            const admin = JSON.parse(localStorage.getItem('admin'));
            const adminId = admin._id;

            const response = await axios.get('http://localhost:4000/api/v1/admins/getUsers', {
                params: {
                    adminId,
                    serviceId
                }
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },

    sendOtp: async (email, type) => {
        try {
            const response = await axios.post('http://localhost:4000/api/v1/admins/send-otp', { email, type });


            if (!response) {
                return false;
            }

            return true;

        } catch (error) {
            console.log(error);
        }
    },

    verfiyOtp: async (email, otp) => {
        console.log(email);
        try {
            const response = await axios.post('http://localhost:4000/api/v1/admins/verify-otp', { email, otp });

            console.log(response);
            if (!response) {
                return false;
            }

            return true;

        } catch (error) {
            console.log(error);
        }
    },

    updateAdmin: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
        const response = await updateAdmin({ name, email, password }, getStoredUser()._id,{
            headers: {
                Authorization: `Bearer ${response.data.data.Token}`  // Attach the token
            }
        });
        set({
            user: response.data.data.updatedUser,
            isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(response.data.data.updatedUser));
        return true;
    } catch (error) {
        set({
        error: error.response?.data?.message || 'Update failed!',
        isLoading: false,
        });
        return false;
    }
    },
    
    fetchAdmins: async () => {
        set({ isLoading: true, error: null });
    
    try {
        const response = await axios.get('http://localhost:4000/api/v1/admins/admins');
        console.log(response.data);
        set({
        admins: response.data.data.admins,
        isLoading: false,
        });
    } catch (error) {
        set({
        error: error.response?.data?.message || 'Failed to fetch admins',
        isLoading: false,
        });
    }
    },
}));

export default useAdminStore;
