import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/v1/services';

export const get_all_service = async () => {
    const token = localStorage.getItem('authToken');
    try {
        console.log(token);
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
        
        const response = await axios.post('http://localhost:4000/api/v1/tokens/tokens',
            {
                service_id,
                user_id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        console.log(response);

        return response;
    } catch (error) {
        throw error;
    }
};
