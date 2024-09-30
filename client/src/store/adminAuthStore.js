import { create } from 'zustand';
import { loginAdmin, signupAdmin } from '../Features/Authentication/adminAuthService';

const useAdminStore = create((set) => ({
    admin: null,
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

    signup: async (name, email, password) => {
        set(() => ({ isLoading: true }));

        try {
            const response = await signupAdmin(name, email, password);

            if (response.success === false) {
                set(() => ({ error: response.message, isLoading: false }));
                return false;
            }

            const authAdmin = response.data.data.newAdmin;
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
            set(() => ({ error: error }));
            return false;
        }
    },

    logout: () => {
        set(() => ({ admin: null, token: null }));
        localStorage.removeItem('admin');
        localStorage.removeItem('token');  // Remove the token
    },
}));

export default useAdminStore;
