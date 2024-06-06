const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user.email,
        name: user.name,
        address: user.address,
    };
    const expiresIn = 60 * 60 * 1; // 1 jam
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
