const loginOtpTemplate = (otp, name) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Welcome back, ${name}!</h2>
        <p>To complete your login, please use the following OTP:</p>
        <h3 style="background-color: #f2f2f2; padding: 10px; display: inline-block;">${otp}</h3>
        <p>This OTP is valid for the next 10 minutes.</p>
    </div>
`;

module.exports = loginOtpTemplate;
