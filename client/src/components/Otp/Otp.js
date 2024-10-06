import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Otp.scss';
import useAdminStore from '../../store/adminAuthStore';

const OtpInput = () => {
    const { verifyOtp } = useAdminStore();

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
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

    const handleSubmit = async () => {
        try {
            const admin = JSON.parse(localStorage.getItem('admin'));
            const email = admin.email;
            const otpString = otp.join('');
            const niceOtp = await verifyOtp(email, otpString);

            if (niceOtp) {
                navigate('/dashboard');
            } else {
                setErrorMessage("Incorrect OTP. Please try again.");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred. Please try again."); 
        }
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
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <button className="verify-btn" onClick={handleSubmit}>
                Verify Email
            </button>
        </div>
    );
};

export default OtpInput;

