import React from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../../../../assets/Images/logo-removebg.png';
import './SignupOption.scss';

const SignupOptions = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <header className="logo-header">
                <div className="logo">
                    <img src={Logo} alt="MedEase" />
                </div>
            </header>
            <div className="login-options">
                <button className="login-btn client-btn" onClick={() => navigate('/client-signup')}>
                    <i className="fas fa-shield-alt"></i> Signup as a Client
                </button>
                <button className="login-btn professional-btn" onClick={() => navigate('/professional-signup')}>
                    <i className="fas fa-user"></i> Signup as a Professional
                </button>
            </div>
        </div>
    );
};

export default SignupOptions;
