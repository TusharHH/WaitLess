import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import useAdminStore from '../../../store/adminAuthStore';
import useUserAuthStore from '../../../store/userAuthStore'; // Import userAuthStore

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');

    // Destructure login methods and states from respective stores
    const { login: adminLogin, isLoading: adminLoading, error: adminError, clearError: clearAdminError } = useAdminStore();
    const { login: userLogin, isLoading: userLoading, error: userError, clearError: clearUserError } = useUserAuthStore();

    // Determine the current loading state and error message based on the selected role
    const isLoading = role === 'admin' ? adminLoading : userLoading;
    const error = role === 'admin' ? adminError : userError;
    const clearError = role === 'admin' ? clearAdminError : clearUserError;

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
         console.log(role)
        const success = role === 'user' 
            ? await userLogin(email, password) // Use appropriate login method
            : await adminLogin(email, password); 

        if (success) {
            navigate('/dashboard'); // Redirect to dashboard upon successful login
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
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
                <div>
                    <label>Role:</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>Login</button>
                {error && <p>{error}</p>} {/* Display error message */}
            </form>
        </div>
    );
};

export default LoginPage;
