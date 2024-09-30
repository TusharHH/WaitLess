import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../../store/adminAuthStore';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, error, clearError } = useAdminStore();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        clearError(); 
        const success = await login(email, password); 

        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={isLoading}>Login</button>
                {error && <p>{error.message}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
