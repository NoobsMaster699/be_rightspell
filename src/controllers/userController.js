const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const generateToken = require('../utils/generateToken');
const validTokens = require('../config/firebase').validTokens;
const { registerSchema, loginSchema } = require('../schemas/userSchema');

const register = async (request, h) => {
    const { name, email, password, confirmPassword } = request.payload;

    // Validasi payload menggunakan Joi
    const { error } = registerSchema.validate({ name, email, password, confirmPassword }, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return h.response({
            message: 'Validation failed',
            errors: errorMessages
        }).code(400);
    }

    try {
        // Cek apakah email sudah ada di database
        const userRef = admin.firestore().collection('users');
        const snapshot = await userRef.where('email', '==', email).get();

        if (!snapshot.empty) {
            return h.response({ message: 'Email already exists' }).code(400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserRef = await userRef.add({
            name,
            email,
            password: hashedPassword,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const userId = newUserRef.id;
        const token = generateToken({ id: userId, email, name });

        validTokens.add(token);

        return h.response({
            message: 'User created',
            userId,
            token
        }).code(201);
    } catch (error) {
        console.error('Error during user registration:', error);

        // Penanganan kesalahan Firebase
        if (error.code === 'permission-denied') {
            return h.response({ message: 'Permission denied' }).code(403);
        }

        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

const login = async (request, h) => {
    const { email, password } = request.payload;

    // Validasi payload menggunakan Joi
    const { error } = loginSchema.validate({ email, password }, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return h.response({
            message: 'Validation failed',
            errors: errorMessages
        }).code(400);
    }

    try {
        const userRef = admin.firestore().collection('users').where('email', '==', email);
        const snapshot = await userRef.get();

        if (snapshot.empty) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const user = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken({ id: userId, email: user.email, name: user.name });
            validTokens.add(token);

            return h.response({
                data: {
                    userId,
                    name: user.name,
                    email: user.email
                },
                token
            }).code(200);
        } else {
            return h.response({ message: 'Incorrect password' }).code(403);
        }
    } catch (error) {
        console.error('Error during user login:', error);

        // Penanganan kesalahan Firebase
        if (error.code === 'permission-denied') {
            return h.response({ message: 'Permission denied' }).code(403);
        }

        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    register,
    login
};
