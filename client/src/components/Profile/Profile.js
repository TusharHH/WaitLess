import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/adminAuthStore';
import Man from '../../assets/Images/man.png';
import './Profile.scss';

const Profile = () => {
  const [profileData, setProfileData] = useState({});

  const { admin } = useAdminStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileData(admin[0]);
      console.log(profileData);
    };
    fetchProfile();
  }, [admin, profileData]);

  const pic = profileData?.avatar || Man;

  // Edit profile function
  const handleEdit = () => {
    console.log('Edit button clicked');
    // Implement edit functionality here
  };

  // Delete profile function
  const handleDelete = () => {
    console.log('Delete button clicked');
    // Implement delete functionality here
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={pic} alt="Profile Avatar" className="profile-avatar" />
        <h1>{profileData?.name}</h1>
        <p>{profileData?.email}</p>
      </div>

      <div className="profile-details">
        <h2>Profile Information</h2>
        <ul>
          <li><strong>Name:</strong> {profileData?.name}</li>
          <li><strong>Email:</strong> {profileData?.email}</li>
          <li><strong>Created At:</strong> {new Date(profileData?.createdAt).toLocaleDateString()}</li>
          <li><strong>Services:</strong> {profileData?.services?.join(', ') || 'N/A'}</li>
        </ul>

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
