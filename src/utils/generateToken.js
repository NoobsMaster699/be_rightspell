const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
    };
    const expiresIn = 60 * 60 * 1; // 1 jam
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
