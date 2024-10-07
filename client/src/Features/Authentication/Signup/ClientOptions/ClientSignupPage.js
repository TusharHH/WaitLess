// ClientSignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';  // Import ClipLoader for spinner
import '../SignupPage.scss';
import useUserAuthStore from '../../../../store/userAuthStore'; 

const ClientSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { signup: userSignup, isLoading: userLoading, error: userError } = useUserAuthStore();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const success = await userSignup(name, email, password);
            if (success) {
                navigate('/u_dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Signup as Client</h2>
                <form onSubmit={handleSignup}>
                    <div className="labelName">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="labelEmail">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="labelPassword">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" disabled={userLoading}>Sign Up</button>

                    {userError && <p className="error">{userError.message || "An error occurred"}</p>}
                </form>

                {/* Render spinner when loading */}
                {userLoading && (
                    <div className="spinner-overlay">
                        <div className="spinner-container">
                            <ClipLoader size={50} color="#ffffff" />
                            <p>Creating your account...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientSignupPage;
