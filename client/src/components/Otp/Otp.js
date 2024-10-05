import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Otp.scss';

const OtpInput = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);


        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = () => {
        navigate('/');
    };

    return (
        <div className="otp-container">
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit code sent to your email address.</p>
            <div className="otp-input">
                {otp.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        className="otp-field"
                        maxLength="1"
                        value={otp[index]}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                    />
                ))}
            </div>
            <button className="verify-btn" onClick={handleSubmit}>
                Verify Email
            </button>
        </div>
    );
};

export default OtpInput;
