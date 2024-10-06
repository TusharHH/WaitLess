import { create } from 'zustand';
import { loginAdmin, signupAdmin, updateAdminService } from '../Features/Authentication/adminAuthService';
import axios from 'axios';

const getStoredUser = () => {
    const storedUser = localStorage.getItem("admin");
    if (!storedUser || storedUser === "undefined") {
        // If no data or invalid data exists, remove and return null
        localStorage.removeItem("admin");
        return null;
    }
    try {
        return JSON.parse(storedUser);  // Only attempt to parse if valid JSON
    } catch (error) {
        console.error("Error parsing stored user data:", error);
        // If data is invalid, remove it from localStorage and return null
        localStorage.removeItem("admin");
        return null;
    }
};




const useAdminStore = create((set) => ({
    admins: [],
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

            console.log(adminId);


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

    verifyOtp: async (email, otp) => {
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

    updateAdmin: async (adminId, formData) => {
        set({ isLoading: true, error: null });
        // for (let pair of formData.entries()) {
        //     console.log(`${pair[0]}: ${pair[1]}`);
        // }

        try {
            const response = await updateAdminService(adminId, formData);
            console.log(response.data);
            const updatedAdmin = response.data.adminDetails
            set({
                admin: updatedAdmin,  // Updated admin data
                isLoading: false,
            });
            localStorage.setItem('admin', JSON.stringify(response.data.data.adminDetails));
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
