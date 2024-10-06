// ProfessionalSignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form'

import useAdminStore from '../../../../store/adminAuthStore';
import '../SignupPage.scss';

const ProfessionalSignupPage = () => {
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [avatar, setAvatar] = useState(null);
    
    const { signup: adminSignup,login:adminLogin, isLoading: adminLoading, error: adminError } = useAdminStore();
    const {register,handleSubmit,formState:{errors}} = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // e.preventDefault();
        const formData = new FormData();  // Create a FormData object
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('location',data.location);
        formData.append('avatar',data.avatar[0]);
        try {
            const signupSuccess = await adminSignup(formData);
            if (signupSuccess) {
                // Login after successful signup
                const email = data.email;
                const password = data.password;
                const loginSuccess = await adminLogin(email,password);
                if (loginSuccess) {
                    navigate('/otp');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h4>Signup as Professional</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="labelName">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            placeholder='Enter your name'
                            {...register('name', { required: 'Name is required' })}
                            required 
                        />
                    </div>
                    <div className="labelEmail">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            placeholder='Enter your email'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                    </div>
                    <div className="labelPassword">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            placeholder='Enter your password'
                            {...register('password', { required: 'Password is required' })}
                        />
                    </div>
                    <div className="labelAvatar">
                        <label>Avatar File:</label>
                        <input 
                            type="file" 
                            accept='image/*'
                            {...register('avatar', { required: 'Avatar is required' })}
                        />
                    </div>
                    <div className="labelName">
                        <label>Location:</label>
                        <input 
                            type="text" 
                            placeholder='Enter your location'
                            {...register('name', { required: 'Name is required' })}
                            required 
                        />
                    </div>
                    <button type="submit" disabled={adminLoading}>Sign Up</button>
                    {adminError && <p className="error">{adminError.message || "An error occurred"}</p>}
                </form>
                {/* {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <ClipLoader size={50} color="#ffffff" />
                        <p>Registering your account...</p>
                    </div>
                )}

                {adminError && <p className="text-red-500">{adminError}</p>} */}
            </div>
        </div>
    );
};

export default ProfessionalSignupPage;
