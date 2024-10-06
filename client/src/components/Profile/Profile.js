import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/adminAuthStore';
import useUserAuthStore from '../../store/userAuthStore';
import useTokenStore from '../../store/tokenStore';
import Man from '../../assets/Images/man.png';
import './Profile.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { admin, updateAdmin, deleteAdmin } = useAdminStore();
  const { user, updateUser } = useUserAuthStore();
  const { token, fetchTokenById, isLoading, error } = useTokenStore();
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [hasClicked, setHasClicked] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null); // State for avatar image

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const navigate = useNavigate();

  // Determine if the user is admin or regular user
  const isAdmin = admin;
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

  // Open Edit Modal
  const handleEdit = () => {
    reset({
      name: profileData?.name || '',
      email: profileData?.email || '',
      password: '' // clear password field
    });
    setAvatar(null); // Reset avatar when opening the modal
    setIsEditModalOpen(true);
  };
  const handleDelete = ()=>{
    console.log("Delete button clicked")
  }
  // Close Edit Modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle avatar image selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    
    // Only append password if it's provided (non-empty)
    if (data.password) {
      formData.append('password', data.password);
    }
  
    // Only append avatar if a file was selected
    if (avatar) {
      formData.append('avatar', avatar);
    }
  
    // Debug FormData content
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
  
    const success = isAdmin
      ? await updateAdmin(admin._id, formData)
      : await updateUser(formData);
  
    if (success) {
      setIsEditModalOpen(false);
      setProfileData(isAdmin ? admin : user); // Update the frontend profile data
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
              {/* Check if services exist and have length */}
              {profileData?.services && profileData.services.length > 0
                ? profileData.services.map((service) => service.name).join(', ')
                : 'N/A'}
            </li>
          )}
        </ul>

        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={() => console.log("Delete functionality here")}>Delete</button>
        </div>
      </div>

      {/* Admin Services Section */}
      {isAdmin && profileData?.services && profileData.services.length > 0 && (
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
                {/* Check if slots exist and have length */}
                {service.slots && service.slots.length > 0 ? (
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
              {token && token?.length > 0 ? (
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
            <form onSubmit={handleSubmit(onSubmit)} className="update-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: true })}
                  defaultValue={profileData.name}
                />
                {errors.name && <span className="error">Name is required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { required: true })}
                  defaultValue={profileData.email}
                />
                {errors.email && <span className="error">Email is required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password (Optional):</label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Profile Picture:</label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <button type="submit" className="submit-btn">Update</button>
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showDeleteWarning && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure?</h2>
            <p>Deleting your account will remove all data and this action cannot be undone.</p>
            <button onClick={handleDelete} className="delete-confirm-btn">Yes, Delete</button>
            <button onClick={() => setShowDeleteWarning(false)} className="delete-cancel-btn">Cancel</button>
          </div>
        </div>
      )}

    </div>

  );
};

export default Profile;
