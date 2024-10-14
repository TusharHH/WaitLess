import axios from 'axios';

const BACKEND_URL = 'https://wait-less-backend-2.vercel.app/api/v1/tokens';

const tokenService = {
    getTokenById: async (id) => {

        try {
            const response = await axios.get(`${BACKEND_URL}/tokens/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllTokens: async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/tokens`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default tokenService;
