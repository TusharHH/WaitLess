import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../../store/adminAuthStore';

const SignupPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const { signup, isLoading, error, setError, clearError } = useAdminStore();

    const handleSignup = async (e) => {

        e.preventDefault();
        clearError();
        
        try {
            const request = await signup(name, email, password);

            if (request) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error);
        }

    };

    return (
        <div className="signup-page">
            <h2>Admin Signup</h2>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Sign Up</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default SignupPage;
