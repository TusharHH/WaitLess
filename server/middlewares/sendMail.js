const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

const sendMail = async (email, subject, htmlContent) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true', 
            auth: {
                user: process.env.SMTP_MAIL_ID, 
                pass: process.env.SMTP_PASSWORD, 
            },
        });

        let mailOptions = {
            from: process.env.SMTP_MAIL_ID, 
            to: email, 
            subject: subject, 
            html: htmlContent, 
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendMail;
