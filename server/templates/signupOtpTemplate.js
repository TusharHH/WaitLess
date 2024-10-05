const signupOtpTemplate = (otp, name) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Welcome to Our Service, ${name}!</h2>
        <p>Thank you for signing up. Please use the following OTP to verify your email:</p>
        <h3 style="background-color: #f2f2f2; padding: 10px; display: inline-block;">${otp}</h3>
        <p>This OTP is valid for the next 10 minutes.</p>
    </div>
`;

module.exports = signupOtpTemplate;
