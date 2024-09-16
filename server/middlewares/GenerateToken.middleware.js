const jwt = require('jsonwebtoken');

const generateToken = (adminId) => {
    
    const payload = {
        id: adminId
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = generateToken;
