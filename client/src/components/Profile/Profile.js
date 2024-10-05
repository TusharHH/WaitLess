// src/components/Profile/Profile.jsx

import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/adminAuthStore';
import useUserAuthStore from '../../store/userAuthStore';
import useTokenStore from '../../store/tokenStore';
import useUserAuthStore from '../../store/userAuthStore';
import useTokenStore from '../../store/tokenStore';
import Man from '../../assets/Images/man.png';
import './Profile.scss';

const Profile = () => {
  const { admin, updateAdmin } = useAdminStore();
  const { user, updateUser } = useUserAuthStore();
  const { token, fetchTokenById, isLoading, error } = useTokenStore();

  const [profileData, setProfileData] = useState({});
  const [hasClicked, setHasClicked] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  // Determine if the user is admin or regular user
  const isAdmin = admin && admin.length > 0;
  const currentUser = isAdmin ? admin[0] : user;

  useEffect(() => {
    if (isAdmin) {
      setProfileData(currentUser);
    if (true) {
      setProfileData(admin);
    } else if (user) {
      setProfileData(user);
    }
  }, [admin, user, isAdmin, currentUser]);

  const pic = profileData?.avatar || Man;

  const handleFetchToken = async () => {
    if (user) {
      await fetchTokenById(user._id);
      setHasClicked(true);
    }
  };

  // Open Edit Modal
  const handleEdit = () => {
    setname(profileData?.name || '');
    setemail(profileData?.email || '');
    setpassword('');
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isAdmin
      ? await updateAdmin(name, email, password)
      : await updateUser(name, email, password);

    if (success) {
      setIsEditModalOpen(false);
      // Optionally, show a success message
    }
    console.log('Edit button clicked');
  };

  const handleDelete = () => {
    console.log('Delete button clicked');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={pic} alt="Profile Avatar" className="profile-avatar" />
        <div>
          <h1>{profileData?.name}</h1>
          <p>{profileData?.email}</p>
        </div>
      </div>

      <div className="profile-details">
        <h2>Profile Information</h2>
        <ul>
          <li>
            <strong>Name:</strong> {profileData?.name}
          </li>
          <li>
            <strong>Email:</strong> {profileData?.email}
          </li>
          <li>
            <strong>Created At:</strong>{' '}
            {new Date(profileData?.createdAt).toLocaleDateString()}
          </li>
          {isAdmin && (
            <li>
              <strong>Services:</strong>{' '}
              {profileData?.services
                ?.map((service) => service.name)
                .join(', ') || 'N/A'}
            </li>
          )}
          <li><strong>Name:</strong> {profileData?.name}</li>
          <li><strong>Email:</strong> {profileData?.email}</li>
          <li><strong>Created At:</strong> {new Date(profileData?.createdAt).toLocaleDateString()}</li>
        </ul>

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* Render Services for Admin */}
      {isAdmin && profileData.services && profileData.services.length > 0 && (
        <div className="admin-services">
          <h2>Services Created</h2>
          {profileData.services.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p>
                <strong>Slot Duration:</strong> {service.slotDuration} minutes
              </p>
              <p>
                <strong>Queue Duration:</strong> {service.queueDuration} minutes
              </p>
              <div className="slots">
                <h4>Slots:</h4>
                {service.slots.map((slot) => (
                  <div key={slot._id} className="slot">
                    <p>
                      <strong>Start Time:</strong> {slot.startTime}
                    </p>
                    <p>
                      <strong>End Time:</strong> {slot.endTime}
                    </p>
                    <p>
                      <strong>Available:</strong> {slot.available ? 'Yes' : 'No'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {/* Services Section */}
        {admin && profileData.services && profileData.services.length > 0 ? (
          <div className="admin-services">
            <h2>Services Created</h2>
            {profileData.services.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p><strong>Slot Duration:</strong> {service.slotDuration} minutes</p>
                <p><strong>Queue Duration:</strong> {service.queueDuration} minutes</p>
                <p><strong>Tags:</strong> {service.tags?.join(', ')}</p>

                <div className="slots">
                  <h4>Slots:</h4>
                  {service.slots && service.slots.length > 0 ? (
                    service.slots.map((slot, index) => (
                      <div key={slot._id} className="slot">
                        <p><strong>Start Time:</strong> {slot.startTime}</p>
                        <p><strong>End Time:</strong> {slot.endTime}</p>
                        <p><strong>Available:</strong> {slot.available ? 'Yes' : 'No'}</p>
                      </div>
                    ))
                  ) : (
                    <p>No slots available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No services created.</p>
        )}

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Token History */}
      {user && (
        <div className="user-tokens">
          <h2>Token History</h2>
          <button onClick={handleFetchToken} className="fetch-tokens-btn">
            Check Tokens
          </button>

          {isLoading && <div>Loading...</div>}
          {error && <div className="error">Error: {error}</div>}

          {hasClicked && !isLoading && !error && (
            <div>
              {token && token.length > 0 ? (
                <>
                  <div className="latest-token">
                    <h3>Latest Token</h3>
                    <p>
                      <strong>Token Number:</strong> {token[token.length - 1].tokenNumber}
                    </p>
                    <p>
                      <strong>User:</strong> {token[token.length - 1].user.name}
                    </p>
                    <p>
                      <strong>Service:</strong>{' '}
                      {token[token.length - 1].service?.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Registration Queue Position:</strong>{' '}
                      {token[token.length - 1].registrationQueuePosition}
                    </p>
                    <p>
                      <strong>Service Queue Position:</strong>{' '}
                      {token[token.length - 1].serviceQueuePosition}
                    </p>
                    <p>
                      <strong>Status:</strong> {token[token.length - 1].status}
                    </p>
                    <p>
                      <strong>Estimated Wait Time:</strong>{' '}
                      {token[token.length - 1].estimatedWaitTime} minutes
                    </p>
                    <p>
                      <strong>Admin Name:</strong>{' '}
                      {token[token.length - 1].service?.admin?.name || 'N/A'}
                    </p>
                    <p>
                      <strong>Admin Email:</strong>{' '}
                      {token[token.length - 1].service?.admin?.email || 'N/A'}
                    </p>
                    <hr />
                  </div>

                  <div className="token-history">
                    <h3>Token History</h3>
                    {token.slice(0, -1).map((tkn, index) => (
                      <div key={index} className="token-card">
                        <p>
                          <strong>Token Number:</strong> {tkn.tokenNumber}
                        </p>
                        <p>
                          <strong>User:</strong> {tkn.user.name}
                        </p>
                        <p>
                          <strong>Service:</strong> {tkn.service?.name || 'N/A'}
                        </p>
                        <p>
                          <strong>Registration Queue Position:</strong>{' '}
                          {tkn.registrationQueuePosition}
                        </p>
                        <p>
                          <strong>Service Queue Position:</strong>{' '}
                          {tkn.serviceQueuePosition}
                        </p>
                        <p>
                          <strong>Status:</strong> {tkn.status}
                        </p>
                        <p>
                          <strong>Estimated Wait Time:</strong>{' '}
                          {tkn.estimatedWaitTime} minutes
                        </p>
                        <p>
                          <strong>Admin Name:</strong>{' '}
                          {tkn.service?.admin?.name || 'N/A'}
                        </p>
                        <p>
                          <strong>Admin Email:</strong>{' '}
                          {tkn.service?.admin?.email || 'N/A'}
                        </p>
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

      {/* Update Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit} className="update-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {isAdmin ? (
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Submit'}
                </button>
              ) : (
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Submit'}
                </button>
              )}
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
