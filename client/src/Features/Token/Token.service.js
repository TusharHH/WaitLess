import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/v1/tokens';

const tokenService = {
    getTokenById: async (id) => {

        console.log("clicked 2 !!");
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
