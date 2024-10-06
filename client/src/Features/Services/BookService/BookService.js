import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import useServiceStore from '../../../store/serviceStore';
import { useNavigate } from 'react-router-dom';
import './BookService.scss';  // Ensure SCSS styles are properly imported
import useUserAuthStore from '../../../store/userAuthStore';

function BookService() {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [query, setQuery] = useState('');

    const {user} = useUserAuthStore();
    const admins = JSON.parse(localStorage.getItem('admin'));
    const User = admins ? admins?.name : user?.name;
    useEffect(()=>{
        if(!User){
            navigate("/signup")
        }
    },[User])

    const { getServices, error, isLoading, createToken } = useServiceStore();
    const navigate = useNavigate();

    const fuseOptions = {
        keys: [
            'name',
            'description',
            'admin.name',
            'admin.email',
            'tags',
        ],
        threshold: 0.3,
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const list = await getServices();
                if (!list) {
                    setErrorMessage("No services available.");
                } else {
                    setServices(list);
                    setFilteredServices(list);
                }
            } catch (error) {
                setErrorMessage("Error fetching services.");
                console.log(error);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (query === '') {
            setFilteredServices(services);
        } else {
            const fuse = new Fuse(services, fuseOptions);
            const result = fuse.search(query);
            setFilteredServices(result.map(({ item }) => item));
        }
    }, [query, services]);

    const bookSlotHandler = async (id) => {
        const response = await createToken(id);
        localStorage.setItem('service_id', id);
        if (response) {
            navigate('/token');
        }
    };

    return (
        <div className="service-container">
            <h1>Schedule your first service !</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search services..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div>
                {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-details">
                                <h3>Service: {service.name}</h3>
                                <p>{service.description}</p>
                                <div className="slots">
                                    <h4>Time slot</h4>
                                    <ul>
                                        {service.slots.map((slot, idx) => (
                                            <li key={idx}>{slot.startTime} to {slot.endTime}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <ul>
                                        {service.tags.map((tag, idxx) => (
                                            <p key={idxx} className='tags'>{tag}</p>
                                        ))}
                                    </ul>
                                </div>
                                <div className="provider-info">
                                    <h4>Service provider</h4>
                                    <p>name: {service.admin?.name}</p>
                                    <p>email: {service.admin?.email}</p>
                                </div>
                            </div>
                            <div className="book-slot">
                                <button onClick={() => bookSlotHandler(service._id)}>Book Slots</button>
                            </div>
                        </div>
                    ))
                ) : (
                    !isLoading && <p>No services available.</p>
                )}
            </div>
        </div>
    );
}

export default BookService;
