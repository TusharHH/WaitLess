import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import useServiceStore from '../../../store/serviceStore';

function BookService() {
    const [getService, setService] = useState([]);
    const [Errors, setErrors] = useState(null);

    const { getServices, error, isLoading, createToken } = useServiceStore();

    const submitHandler = async () => {
        try {
            const list = await getServices();
            if (!list) {
                setErrors("No services available.");
            } else {
                setService(list);
            }
        } catch (error) {
            setErrors("Error fetching services.");
            console.log(error);
        }
    }

    const bookSlotHandler = async (service_id) => {
        const response = await createToken(service_id);

        console.log(response);
        
    }

    return (
        <div>
            <button onClick={submitHandler}>See Services</button>

            {/* Show loading state */}
            {isLoading && <p>Loading...</p>}

            {/* Show error if present */}
            {Errors && <p style={{ color: 'red' }}>{Errors}</p>}

            {/* Display services if available */}
            <div>
                {getService.length > 0 ? (
                    getService.map((service, index) => (
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
                            <button onClick={() => { bookSlotHandler(service._id) }}>Book Slots</button>
                            {/* Display admin name and email */}
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
