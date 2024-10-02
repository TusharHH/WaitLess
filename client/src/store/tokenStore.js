import { create } from 'zustand';
import tokenService from '../Features/Token/Token.service.js';

const useTokenStore = create((set) => ({
    token: null,
    tokens: [],
    error: null,
    isLoading: false,

    clearError: () => set(() => ({ error: null })),

    fetchTokenById: async (id) => {

        set(() => ({ isLoading: true }));

        try {
            const response = await tokenService.getTokenById(id);

            if (!response.success) {
                set(() => ({ error: response.message, isLoading: false }));
                return false;
            }

            set(() => ({ token: response.data.token, isLoading: false }));
            return true;
        } catch (error) {
            set(() => ({ error: error.message, isLoading: false }));
            return false;
        }
    },

    fetchAllTokens: async () => {
        set(() => ({ isLoading: true }));

        try {
            const response = await tokenService.getAllTokens();

            if (!response.success) {
                set(() => ({ error: response.message, isLoading: false }));
                return false;
            }

            set(() => ({ tokens: response.data.tokens, isLoading: false }));
            return true;
        } catch (error) {
            set(() => ({ error: error.message, isLoading: false }));
            return false;
        }
    },

    clearToken: () => set(() => ({ token: null, tokens: [] })),
}));

export default useTokenStore;
