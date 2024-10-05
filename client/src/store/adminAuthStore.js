import { create } from 'zustand';
import { loginAdmin, signupAdmin } from '../Features/Authentication/adminAuthService';
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
        set(() => ({ isLoading: true ,error:null}));

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
                admin:authAdmin,
                error: null, 
                isLoading: false,
                token:token,
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
        localStorage.removeItem('token');  // Remove the token
    },
    getUsers: async (serviceId) => {
        try {
            const admin = JSON.parse(localStorage.getItem('admin'));
            const adminId = admin[0]._id;

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
    }
}));

export default useAdminStore;
