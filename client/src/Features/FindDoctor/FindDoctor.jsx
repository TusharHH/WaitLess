import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js
import useAdminStore from '../../store/adminAuthStore'; // Import the admin store
import './FindDoctor.scss';
import MAN from '../../assets/Images/man.png';

function FindDoctor() {
    const { admins, fetchAdmins, isLoading, error } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAdmins, setFilteredAdmins] = useState(admins);

    useEffect(() => {
        fetchAdmins(); // Fetch admins on component mount
    }, [fetchAdmins]);

    useEffect(() => {
        // Initialize Fuse.js
        const fuse = new Fuse(admins, {
            keys: ['name', 'email', 'services.name'], // Specify keys to search on
            includeScore: true,
            threshold: 0.3, // Adjust the threshold for accuracy
        });

        // Perform search if searchQuery is not empty
        if (searchQuery) {
            const results = fuse.search(searchQuery);
            setFilteredAdmins(results.map(result => result.item)); // Update filtered admins
        } else {
            setFilteredAdmins(admins); // Reset to original admins when search query is empty
        }
    }, [searchQuery, admins]); // Re-run when searchQuery or admins change

    return (
        <div className="find-doctor-container">
            <h1>Find a Doctor</h1>
            <input 
                type="text" 
                placeholder="Search for doctors..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="search-bar" 
            />

            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {!isLoading && filteredAdmins.length === 0 && <p>No doctors available.</p>}

            <div className="admin-list">
                {filteredAdmins.map((admin) => (
                    <div key={admin._id} className="admin-card">
                        <img
                            src={admin.avatar || MAN}
                            alt={admin.name}
                            className="admin-avatar"
                        />
                        <h3>{admin.name}</h3>
                        <p>Email: {admin.email}</p>
                        <p>Services: {admin.services?.map(service => service.name).join(', ') || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FindDoctor;
