import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/Service/ServiceCard';
import useAdminStore from '../../store/adminAuthStore';
import useServiceStore from '../../store/serviceStore.js';

import './Dashboard.scss';

function Dashboard() {
    const { admin, logout, getUsers } = useAdminStore();
    const { services, fetchServices, createService, updateService, deleteService, error, loading } = useServiceStore();
    const navigate = useNavigate();

    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        slots: [{ startTime: '', endTime: '' }],
        slotDuration: '',
        queueDuration: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [serviceIdToEdit, setServiceIdToEdit] = useState(null);
    const [queueData, setQueueData] = useState(null);  // State for storing queue data

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleLogout = async () => {
        logout();
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const handleSlotChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSlots = serviceData.slots.map((slot, i) =>
            i === index ? { ...slot, [name]: value } : slot
        );
        setServiceData({ ...serviceData, slots: updatedSlots });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateService(serviceIdToEdit, serviceData);
            setIsEditing(false);
        } else {
            await createService(serviceData);
        }
        setServiceData({
            name: '',
            description: '',
            slots: [{ startTime: '', endTime: '' }],
            slotDuration: '',
            queueDuration: ''
        });
    };

    const handleEdit = (service) => {
        setServiceData({
            name: service.name,
            description: service.description,
            slots: service.slots,
            slotDuration: service.slotDuration,
            queueDuration: service.queueDuration
        });
        setIsEditing(true);
        setServiceIdToEdit(service._id);
    };

    const handleDelete = async (id) => {
        await deleteService(id);
    };

    const handleShowQueue = async (serviceId) => {
        try {
            const response = await getUsers(serviceId);
            setQueueData(response.data.users);
        } catch (error) {
            console.error('Failed to fetch queue', error);
        }
    };

    return (
        <div className='dashboard'>
            <h1>Admin Dashboard</h1>
            <p>admin: {admin?.[0]?.name || 'No user found'}</p>

            <button onClick={handleLogout} className="logout-btn">Logout</button>

            <h2>{isEditing ? 'Edit Service' : 'Create Service'}</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    name="name"
                    value={serviceData.name}
                    onChange={handleInputChange}
                    placeholder="Service Name"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={serviceData.description}
                    onChange={handleInputChange}
                    placeholder="Service Description"
                    required
                />
                <div>
                    {serviceData.slots.map((slot, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="startTime"
                                value={slot.startTime}
                                onChange={(e) => handleSlotChange(e, index)}
                                placeholder="Start Time"
                                required
                            />
                            <input
                                type="text"
                                name="endTime"
                                value={slot.endTime}
                                onChange={(e) => handleSlotChange(e, index)}
                                placeholder="End Time"
                                required
                            />
                        </div>
                    ))}
                </div>
                <input
                    type="number"
                    name="slotDuration"
                    value={serviceData.slotDuration}
                    onChange={handleInputChange}
                    placeholder="Slot Duration (minutes)"
                    required
                />
                <input
                    type="number"
                    name="queueDuration"
                    value={serviceData.queueDuration}
                    onChange={handleInputChange}
                    placeholder="Queue Duration (minutes)"
                    required
                />
                <button type="submit" className="form-btn">{isEditing ? 'Update' : 'Create'} Service</button>
            </form>

            <h2>Available Services</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="container">
                {services.length > 0 ? (
                    services.map((service) => (
                        <div key={service._id} className="service-card">
                            <ServiceCard
                                serviceName={service.name}
                                serviceDescription={service.description}
                                serviceStartingTime={service.slots[0]?.startTime || 'N/A'}
                                serviceEndingTime={service.slots[0]?.endTime || 'N/A'}
                                serviceSlotTime={service.slotDuration}
                                onShowQueue={() => handleShowQueue(service._id)}
                            />
                            <div className="card-actions">
                                <button onClick={() => handleEdit(service)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(service._id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No services available.</p>
                )}
            </div>

            {queueData && (
                <div className="queue-info">
                    <h3>Users in Queue</h3>
                    {queueData.length > 0 ? (
                        <ul>
                            {queueData.map((user, index) => (
                                <li key={index}>
                                    {user.name} (Position: {user.serviceQueuePosition})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No one in the queue</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
