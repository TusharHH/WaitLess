const axios = require('axios');

const BACKEND_URL = 'http://localhost:4000/api/v1/services';

const get_all_service = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${BACKEND_URL}/services`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};


module.exports = { get_all_service };
