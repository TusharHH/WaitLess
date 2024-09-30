import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/Service/ServiceCard';
import useAdminStore from '../../store/adminAuthStore';
import useServiceStore from '../../store/serviceStore.js';

function Dashboard() {
    const { admin, logout } = useAdminStore();
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

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>admin: {admin?.[0]?.name || 'No user found'}</p>

            <button onClick={handleLogout}>Logout</button>

            <h2>{isEditing ? 'Edit Service' : 'Create Service'}</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">{isEditing ? 'Update' : 'Create'} Service</button>
            </form>

            <h2>Available Services</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="container">
                {services.length > 0 ? (
                    services.map((service) => (
                        <div key={service._id}>
                            <ServiceCard
                                serviceName={service.name}
                                serviceDescription={service.description}
                                serviceStartingTime={service.slots[0]?.startTime || 'N/A'}
                                serviceEndingTime={service.slots[0]?.endTime || 'N/A'}
                                serviceSlotTime={service.slotDuration}
                            />
                            <button onClick={() => handleEdit(service)}>Edit</button>
                            <button onClick={() => handleDelete(service._id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No services available.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
