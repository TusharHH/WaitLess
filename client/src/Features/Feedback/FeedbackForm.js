import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackForm.scss';
import useAdminStore from '../../store/adminAuthStore';
import { ClipLoader } from 'react-spinners'; // Import the loader

const FeedbackForm = () => {
  const [senderType, setSenderType] = useState('admin');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { admin } = useAdminStore();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const User = admin ? admin?.name : user?.name;
  useEffect(() => {
    if (!User) {
      navigate("/signup");
    }
  }, [User, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackMessage) {
      setError('Feedback message is required.');
      return;
    }

    setLoading(true); // Start the loader

    try {
      const response = await fetch('https://wait-less-backend-2.vercel.app/api/v1/admins/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderType === 'admin' ? admin[0]._id : user?._id,
          senderType,
          feedbackMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Feedback sent successfully!');
        setFeedbackMessage('');
        setError(null);
      } else {
        setError(data.message || 'Failed to send feedback.');
      }
    } catch (err) {
      setError('An error occurred while sending feedback.');
    }

    setLoading(false); // Stop the loader after form submission
  };

  return (
    <div className="feedback-form-container">
      <h2 className="form-title">Send Feedback</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading ? (
        <div className="loader-container">
          <ClipLoader color="#4A90E2" loading={loading} size={50} /> {/* Show loader */}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="senderType">I am a:</label>
            <select
              id="senderType"
              value={senderType}
              onChange={(e) => setSenderType(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="feedbackMessage">Your Feedback:</label>
            <textarea
              id="feedbackMessage"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows="5"
              placeholder="Write your feedback here..."
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
