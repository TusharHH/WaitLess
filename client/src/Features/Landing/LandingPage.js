import React from 'react';
import { useNavigate } from 'react-router-dom';

import './LandingPage.scss';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <header className="navbar">
                <div className="logo">WaitLess</div>
                <div className="nav-buttons">
                    <button className="signup-btn" onClick={() => navigate('/signup')}>Signup</button>
                    <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                </div>
            </header>

            <section className="hero-section">
                <h1>Book your spot, skip the wait</h1>
                <p>Because waiting is overrated</p>
                <button className="cta-btn" onClick={() => navigate('/signup')}>Start Your 14-Day Trial</button>

                <div className="features">
                    <div className="feature-item">Convenient Waitlist</div>
                    <div className="feature-item">Easy to Use</div>
                    <div className="feature-item">Makes Customers and Staff Happier</div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;