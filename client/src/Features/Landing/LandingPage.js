import React from 'react';
import { useNavigate } from 'react-router-dom';

import './LandingPage.scss';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">

            <section className="hero-section">
                <h1>
                    “Your <span className="health">Health</span>, Your <span className="schedule">Schedule</span><br/>
                    Book Instantly”
                </h1>
                <p>Feel Better Sooner!</p>
                <button className="cta-btn" onClick={() => navigate('/signup')}>
                    Start Your 14-Day Trial
                </button>

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
