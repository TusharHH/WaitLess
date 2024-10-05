import { create } from 'zustand';
import axios from 'axios';
import { create_token, get_all_service } from '../Features/Services/serviceService';

const BACKEND_URL = 'http://localhost:4000/api/v1/services';

const useServiceStore = create((set) => ({
    services: [],
    error: null,
    loading: false,

    getAuthToken: () => {
        return localStorage.getItem('token');
    },

    fetchServices: async () => {
        set({ loading: true });
        const token = localStorage.getItem('token');  // Get the token

        try {
            const response = await axios.get(`${BACKEND_URL}/service`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Attach the token
                }
            });
            set({ services: response.data.data, loading: false });
            return response.data.data
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error fetching services', loading: false });
        }
    },

    createService: async (serviceData) => {
        set({ loading: true });
        const token = localStorage.getItem('token');  // Get the token
        try {
            const response = await axios.post(`${BACKEND_URL}/service`, serviceData, {
                headers: {
                    Authorization: `Bearer ${token}`  // Attach the token
                }
            });
            set((state) => ({
                services: [...state.services, response.data.data],
                loading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error creating service', loading: false });
        }
    },

    updateService: async (id, updatedServiceData) => {
        set({ loading: true });
        const token = localStorage.getItem('token');  // Get the token
        try {
            const response = await axios.put(`${BACKEND_URL}/service/${id}`, updatedServiceData, {
                headers: {
                    Authorization: `Bearer ${token}`  // Attach the token
                }
            });
            set((state) => ({
                services: state.services.map((service) =>
                    service._id === id ? response.data.data : service
                ),
                loading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error updating service', loading: false });
        }
    },

    deleteService: async (id) => {
        set({ loading: true });
        const token = localStorage.getItem('token');  // Get the token
        try {
            await axios.delete(`${BACKEND_URL}/service/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Attach the token
                }
            });
            set((state) => ({
                services: state.services.filter((service) => service._id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error deleting service', loading: false });
        }
    },

    getServices: async () => {
        set({ loading: true, error: null });
        try {
            const response = await get_all_service();
            if (!response) {
                set({ error: "No service available !!" });
            };
            set({
                services: response.data.data,
                loading: false,
                error: null,
            });
            return response.data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createToken: async (service_id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const user_id = user._id;


            const response = await create_token(service_id, user_id);

            if (!response) {
                return false;
            }
            
            return response;


        } catch (error) {
            console.log(error);

        }
    }
}));

export default useServiceStore;
