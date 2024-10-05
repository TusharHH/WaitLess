// ClientSignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                    {userError && <p className="error">{userError}</p>}
                </form>
            </div>
        </div>
    );
};

export default ClientSignupPage;
