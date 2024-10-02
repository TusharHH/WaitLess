import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/v1/services';

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
