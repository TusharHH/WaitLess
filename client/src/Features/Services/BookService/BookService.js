import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import useServiceStore from '../../../store/serviceStore';
import { useNavigate } from 'react-router-dom';

function BookService() {
    const [getService, setService] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [Errors, setErrors] = useState(null);
    const [query, setQuery] = useState('');

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

    const submitHandler = async () => {
        try {
            const list = await getServices();

            if (!list) {
                setErrors("No services available.");
            } else {
                setService(list);
                setFilteredServices(list);
            }
        } catch (error) {
            setErrors("Error fetching services.");
            console.log(error);
        }
    };

    useEffect(() => {
        if (query === '') {
            setFilteredServices(getService);
        } else {
            const fuse = new Fuse(getService, fuseOptions);
            const result = fuse.search(query);
            setFilteredServices(result.map(({ item }) => item));
        }
    }, [query, getService]);

    const bookSlotHandler = async (id) => {
        const response = await createToken(id);
        localStorage.setItem('service_id', id);
        if (response) {
            navigate('/token');
        }
    };

    return (
        <div>
            <button onClick={submitHandler}>See Services</button>
            <div style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search services..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: '10px', width: '300px' }}
                />
            </div>

            <div>
                {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                        <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <p>Queue Duration: {service.queueDuration} minutes</p>
                            <p>Slot Duration: {service.slotDuration} minutes</p>
                            <h4>Available Slots:</h4>
                            <ul>
                                {service.slots.map((slot, idx) => (
                                    <li key={idx}>
                                        {slot.startTime} - {slot.endTime} (Available: {slot.available ? 'Yes' : 'No'})
                                    </li>
                                ))}
                            </ul>
                            <h4>Tags:</h4>
                            <ul>
                                {service.tags.map((tag, idx) => (
                                    <li key={idx}>{tag}</li>
                                ))}
                            </ul>
                            <button onClick={() => bookSlotHandler(service._id)}>Book Slots</button>

                            {service.admin && (
                                <div>
                                    <h4>Service Provider:</h4>
                                    <p>Name: {service.admin.name}</p>
                                    <p>Email: {service.admin.email}</p>
                                </div>
                            )}
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
