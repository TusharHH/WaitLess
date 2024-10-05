const resetPasswordOtpTemplate = (otp, name) => `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
        <h3 style="background-color: #f2f2f2; padding: 10px; display: inline-block;">${otp}</h3>
        <p>If you didn’t request a password reset, please ignore this email.</p>
    </div>
`;

module.exports = resetPasswordOtpTemplate;
