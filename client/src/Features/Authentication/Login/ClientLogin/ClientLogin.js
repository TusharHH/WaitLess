// ClientLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserAuthStore from '../../../../store/userAuthStore.js';
import './clientLogin.scss';

const ClientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login: userLogin, isLoading: userLoading, error: userError, clearError: clearUserError } = useUserAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const success = await userLogin(email, password);

        if (success) {
            navigate('/u_dashboard');
        } else {
            console.log('Login failed for client!');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login as Client</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={userLoading}>Login</button>
                    {userError && <p className="error">{userError}</p>}
                </form>
            </div>
        </div>
    );
};

export default ClientLogin;
