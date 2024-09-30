import { create } from 'zustand';
import { loginAdmin, signupAdmin } from '../Features/Authentication/adminAuthService';

const useAdminStore = create((set) => ({

    admin: null,
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
            if (!authAdmin) {
                set(() => ({ error: 'Something went wrong!', isLoading: false }));
                return false;
            }

            set(() => ({ admin: authAdmin, isLoading: false }));
            localStorage.setItem('admin', JSON.stringify(authAdmin));

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
            if (!authAdmin) {
                set(() => ({ error: 'Something went wrong!', isLoading: false }));
                return false;
            }

            set(() => ({ admin: authAdmin, isLoading: false }));
            localStorage.setItem('admin', JSON.stringify(authAdmin));

            return true;

        } catch (error) {
            set(() => ({ error: error }));
            return false;
        }
    },

    logout: () => {
        set(() => ({ admin: null }));
        localStorage.removeItem('admin');
    },

}));

export default useAdminStore;
