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
        queueDuration: '',
        tags: []  // New field for tags
    });

    const [tagInput, setTagInput] = useState('');  // State for handling tag input
    const [isEditing, setIsEditing] = useState(false);
    const [serviceIdToEdit, setServiceIdToEdit] = useState(null);
    const [queueData, setQueueData] = useState(null);  // State for storing queue data

    useEffect(() => {
        if (admin) {  // Fetch services only if admin exists
            fetchServices();
        }
    }, [fetchServices, admin]);

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

    // Handle adding tags to service
    const handleAddTag = () => {
        if (tagInput.trim()) {
            setServiceData({ ...serviceData, tags: [...serviceData.tags, tagInput.trim()] });
            setTagInput('');  // Clear the tag input
        }
    };

    // Remove tag function
    const handleRemoveTag = (indexToRemove) => {
        setServiceData({
            ...serviceData,
            tags: serviceData.tags.filter((_, index) => index !== indexToRemove)
        });
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
            queueDuration: '',
            tags: []  // Clear tags after submission
        });
    };

    const handleEdit = (service) => {
        setServiceData({
            name: service.name,
            description: service.description,
            slots: service.slots,
            slotDuration: service.slotDuration,
            queueDuration: service.queueDuration,
            tags: service.tags || []  // Handle tags
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
            console.log(response);
            setQueueData(response.data.users);
        } catch (error) {
            console.error('Failed to fetch queue', error);
        }
    };

    return (
        <div className='dashboard'>
            <h1>Admin Dashboard</h1>
            <p>admin: {admin?.name || 'No user found'}</p>

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

                {/* Tag Input */}
                <div className="tags-input">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Enter tag"
                    />
                    <button type="button" onClick={handleAddTag}>Add Tag</button>
                    <div className="tags-list">
                        {serviceData.tags.map((tag, index) => (
                            <div key={index} className="tag-item">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(index)}>x</button>
                            </div>
                        ))}
                    </div>
                </div>

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
                                tags={service.tags} 
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
