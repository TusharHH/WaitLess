// ProfessionalLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../../../store/adminAuthStore';
import '../ClientLogin/clientLogin.scss';
import { ThreeDots } from 'react-loader-spinner';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSending, setSending] = useState(false); 

    const { login, isLoading: adminLoading, error: adminError, clearError: clearAdminError, sendOtp } = useAdminStore();
    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();

        const success = await login(email, password);

        if (success) {
            setSending(true);
            await sendOtp(email, "login");
            setSending(false);
            navigate('/dashboard');
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
                    {isSending && <ThreeDots color="#00BFFF" height={80} width={80} />} {/* Loader component */}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
