import axios from 'axios';

const BACKEND_URL = 'https://wait-less-backend-2.vercel.app/api/v1/services';

export const get_all_service = async () => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await axios.get(`${BACKEND_URL}/services`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const create_token = async (service_id, user_id) => {
    const token = localStorage.getItem('authToken');
    try {
        
        const response = await axios.post('https://wait-less-backend-2.vercel.app/api/v1/tokens/tokens',
            {
                service_id,
                user_id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return response;
    } catch (error) {
        throw error;
    }
};
