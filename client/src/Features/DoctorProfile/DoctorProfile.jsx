import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAdminStore from '../../store/adminAuthStore';
import './DoctorProfile.scss'; // Create a style file if needed
import MAN from '../../assets/Images/man.png'


function DoctorProfile() {

    const { adminId } = useParams(); // Get the admin ID from the URL
    const { fetchAdminById, isLoading, error } = useAdminStore(); // Assuming you have a function to fetch admin by ID
    const [admin, setAdmin] = useState(null);

 useEffect(() => {
        async function loadAdmin() {
            const fetchedAdmin = await fetchAdminById(adminId); // Fetch admin details by ID
            setAdmin(fetchedAdmin);
        }

        loadAdmin();
    }, [adminId, fetchAdminById]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!admin) return <p>Admin not found</p>;

return (
        <div className="admin-profile-container">
            {/* Admin Profile Card */}
            <div className="profile-card">
                <img
                    src={admin.avatar || MAN}
                    alt={admin.name}
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <h2>{admin.name}</h2>
                    <p>Email: {admin.email}</p>
                    <p>Location: {admin.location}</p>
                    <p>Created At: {new Date(admin.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Admin Services */}
            <div className="services-section">
                <h3>Services</h3>
                {admin.services.length > 0 ? (
                    admin.services.map((service) => (
                        <div key={service._id} className="service-card">
                            <h4>{service.name}</h4>
                            <p>Description: {service.description}</p>
                            <p>Slots: {service.slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ')}</p>
                            <p>Slot Duration: {service.slotDuration} minutes</p>
                            <p>Queue Duration: {service.queueDuration} minutes</p>
                            <p>Tags: {service.tags.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>No services available.</p>
                )}
            </div>
        </div>
    );
}


export default DoctorProfile
