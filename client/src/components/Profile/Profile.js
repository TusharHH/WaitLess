import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/adminAuthStore';
import useUserAuthStore from '../../store/userAuthStore'; // Import user auth store
import useTokenStore from '../../store/tokenStore'; // Import token store
import Man from '../../assets/Images/man.png';
import './Profile.scss';

const Profile = () => {
  const { admin } = useAdminStore();
  const { user } = useUserAuthStore();
  const { token, fetchTokenById, isLoading, error } = useTokenStore();

  const [profileData, setProfileData] = useState({});
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (admin && admin.length > 0) {
      setProfileData(admin[0]);
    } else if (user) {
      setProfileData(user);
    }
  }, [admin, user]);

  const pic = profileData?.avatar || Man;

  // Fetch tokens for user
  const handleFetchToken = async () => {
    if (user) {
      await fetchTokenById(user._id);
      setHasClicked(true);
    }
  };

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
          {admin && (
            <li><strong>Services:</strong> {profileData?.services?.map(service => service.name).join(', ') || 'N/A'}</li>
          )}
        </ul>

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Render Services for Admin */}
      {admin && admin.length > 0 && (
        <div className="admin-services">
          <h2>Services Created</h2>
          {profileData.services && profileData.services.length > 0 ? (
            profileData.services.map(service => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p><strong>Slot Duration:</strong> {service.slotDuration} minutes</p>
                <p><strong>Queue Duration:</strong> {service.queueDuration} minutes</p>
                <div className="slots">
                  <h4>Slots:</h4>
                  {service.slots.map(slot => (
                    <div key={slot._id} className="slot">
                      <p><strong>Start Time:</strong> {slot.startTime}</p>
                      <p><strong>End Time:</strong> {slot.endTime}</p>
                      <p><strong>Available:</strong> {slot.available ? 'Yes' : 'No'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No services created.</p>
          )}
        </div>
      )}

      {/* Render Token History for User */}
      {user && (
        <div className="user-tokens">
          <h2>Token History</h2>
          <button onClick={handleFetchToken} className="fetch-tokens-btn">Check Tokens</button>

          {isLoading && <div>Loading...</div>}
          {error && <div className="error">Error: {error}</div>}

          {hasClicked && !isLoading && !error && (
            <div>
              {token && token.length > 0 ? (
                <>
                  <div className="latest-token">
                    <h3>Latest Token</h3>
                    <p><strong>Token Number:</strong> {token[token.length - 1].tokenNumber}</p>
                    <p><strong>User:</strong> {token[token.length - 1].user.name}</p>
                    <p><strong>Service:</strong> {token[token.length - 1].service?.name || 'N/A'}</p>
                    <p><strong>Registration Queue Position:</strong> {token[token.length - 1].registrationQueuePosition}</p>
                    <p><strong>Service Queue Position:</strong> {token[token.length - 1].serviceQueuePosition}</p>
                    <p><strong>Status:</strong> {token[token.length - 1].status}</p>
                    <p><strong>Estimated Wait Time:</strong> {token[token.length - 1].estimatedWaitTime} minutes</p>
                    <p><strong>Admin Name:</strong> {token[token.length - 1].service?.admin?.name || 'N/A'}</p>
                    <p><strong>Admin Email:</strong> {token[token.length - 1].service?.admin?.email || 'N/A'}</p>
                    <hr />
                  </div>

                  <div className="token-history">
                    <h3>Token History</h3>
                    {token.slice(0, -1).map((tkn, index) => (
                      <div key={index} className="token-card">
                        <p><strong>Token Number:</strong> {tkn.tokenNumber}</p>
                        <p><strong>User:</strong> {tkn.user.name}</p>
                        <p><strong>Service:</strong> {tkn.service?.name || 'N/A'}</p>
                        <p><strong>Registration Queue Position:</strong> {tkn.registrationQueuePosition}</p>
                        <p><strong>Service Queue Position:</strong> {tkn.serviceQueuePosition}</p>
                        <p><strong>Status:</strong> {tkn.status}</p>
                        <p><strong>Estimated Wait Time:</strong> {tkn.estimatedWaitTime} minutes</p>
                        <p><strong>Admin Name:</strong> {tkn.service?.admin?.name || 'N/A'}</p>
                        <p><strong>Admin Email:</strong> {tkn.service?.admin?.email || 'N/A'}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No token history available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
