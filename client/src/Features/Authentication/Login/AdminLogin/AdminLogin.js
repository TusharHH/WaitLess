// ProfessionalLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../../../store/adminAuthStore';
import '../ClientLogin/clientLogin.scss';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading: adminLoading, error: adminError, clearError: clearAdminError, sendOtp } = useAdminStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const success = await login(email, password);

        if (success) {
            await sendOtp(email, "login");
            navigate('/otp');
        } else {
            console.log('Login failed for professional!');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login as Professional</h2>
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
                    <button type="submit" disabled={adminLoading}>Login</button>
                    {adminError && <p className="error">{adminError}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
