import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../../store/adminAuthStore';
import useUserAuthStore from '../../../store/userAuthStore'; // Import userAuthStore
import './SignupPage.scss';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // State for role selection

    const navigate = useNavigate();

    const { signup: adminSignup, isLoading: adminLoading, error: adminError} = useAdminStore();
    const { signup: userSignup, isLoading: userLoading, error: userError } = useUserAuthStore();

    const isLoading = role === 'admin' ? adminLoading : userLoading; // Determine loading state based on role
    const error = role === 'admin' ? adminError : userError; // Determine error based on role
    // const clearError = role === 'admin' ? clearAdminError : clearUserError; // Determine clear error based on role
    const signup = role === 'admin' ? adminSignup : userSignup; // Determine signup function based on role

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const request = await signup(name, email, password);

            if (request) {
                navigate('/dashboard');
            }
        } catch (error) {
            // if (role === 'admin') {
            //     setAdminError(error);
            // } else {
            //     setUserError(error);
            // }
             console.log(error);
        }
    };

    return (
        <div className="signup-page">
            <div className='signupContainer'>
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
                    <div className='labelRole'>
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
                    <div className='labelName'>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className='labelEmail'>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='labelPassword'>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={isLoading}>Sign Up</button>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
