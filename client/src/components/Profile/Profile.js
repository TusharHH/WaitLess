import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/adminAuthStore';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null); // New state for avatar

  // Determine if the user is admin or a regular user
  const isAdmin = admin;
  // console.log(isAdmin)
  const currentUser = isAdmin ? admin : user;

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  const pic = profileData?.avatar || Man;

  const handleFetchToken = async () => {
    if (user) {
      await fetchTokenById(user._id);
      setHasClicked(true);
    }
  };

  const handleDelete = ()=>{
    console.log("hello")
  }
  // Open Edit Modal
  const handleEdit = () => {
    setName(profileData?.name || '');
    setEmail(profileData?.email || '');
    setPassword('');
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const success = isAdmin
      ? await updateAdmin(formData)
      : await updateUser(formData);

    if (success) {
      setIsEditModalOpen(false);
    }
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
          <li><strong>Name:</strong> {profileData?.name}</li>
          <li><strong>Email:</strong> {profileData?.email}</li>
          <li><strong>Created At:</strong> {new Date(profileData?.createdAt).toLocaleDateString()}</li>
          {isAdmin && (
            <li>
              <strong>Services:</strong> 
              {profileData?.services?.map((service) => service.name).join(', ') || 'N/A'}
            </li>
          )}
        </ul>

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Admin Services Section */}
      {isAdmin && profileData.services && profileData.services.length > 0 && (
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
                {service.slots.length > 0 ? (
                  service.slots.map((slot) => (
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
      )}

      {/* Token History Section */}
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
                    <p><strong>Token Number:</strong> {token[token.length - 1].tokenNumber}</p>
                    <p><strong>User:</strong> {token[token.length - 1].user.name}</p>
                    <p><strong>Service:</strong> {token[token.length - 1].service?.name || 'N/A'}</p>
                    <p><strong>Status:</strong> {token[token.length - 1].status}</p>
                  </div>

                  <div className="token-history">
                    <h3>Token History</h3>
                    {token.slice(0, -1).map((tkn, index) => (
                      <div key={index} className="token-card">
                        <p><strong>Token Number:</strong> {tkn.tokenNumber}</p>
                        <p><strong>User:</strong> {tkn.user.name}</p>
                        <p><strong>Service:</strong> {tkn.service?.name || 'N/A'}</p>
                        <p><strong>Status:</strong> {tkn.status}</p>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="update-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar:</label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Submit'}
              </button>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
