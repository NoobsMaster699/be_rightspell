const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const generateToken = require('../utils/generateToken');
const validTokens = require('../config/firebase').validTokens;

// Sign Up Handler
const register = async (request, h) => {
    const { name, email, password } = request.payload;

    try {
        const userRef = admin.firestore().collection('users').doc(email);
        const snapshot = await userRef.get();
        if (snapshot.exists) {
            return h.response({ message: 'User already exists' }).code(409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userRef.set({
            name,
            email,
            password: hashedPassword,
            address: "-"
        });

        return h.response({ message: 'User created' }).code(201);
    } catch (error) {
        console.error('Error during user registration:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Login Handler
const login = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const userRef = admin.firestore().collection('users').doc(email);
        const snapshot = await userRef.get();
        const user = snapshot.data();

        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken(user);
            validTokens.add(token);

            return h.response({
                data: {
                    id: user.email,
                    name: user.name,
                    address: user.address,
                },
                token
            }).code(200);
        } else {
            return h.response({ message: 'Wrong password' }).code(403);
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    register,
    login
};
