const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const generateToken = require('../utils/generateToken');
const validTokens = require('../config/firebase').validTokens;
const Joi = require('joi');

// Validasi menggunakan Joi
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')).required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and contain letters, numbers, and special characters.'
        }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
});

// Sign Up Handler
const register = async (request, h) => {
    const { name, email, password, confirmPassword } = request.payload;

    // Validasi payload menggunakan Joi
    const { error } = userSchema.validate({ name, email, password, confirmPassword });
    if (error) {
        return h.response({ message: error.details[0].message }).code(400);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRef = admin.firestore().collection('users'); // Menghapus ".doc(email)"
        const newUserRef = await userRef.add({ // Menggunakan metode "add" tanpa argumen untuk mendapatkan ID otomatis
            name,
            email,
            password: hashedPassword,
        });

        const userId = newUserRef.id; // Mendapatkan ID dokumen yang baru dibuat

        return h.response({ message: 'User created', userId }).code(201);
    } catch (error) {
        console.error('Error during user registration:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Login Handler
const login = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const userRef = admin.firestore().collection('users').where('email', '==', email); // Menggunakan query untuk mencari pengguna berdasarkan email
        const snapshot = await userRef.get();

        if (snapshot.empty) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const user = snapshot.docs[0].data(); // Mengambil data pengguna dari hasil query

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken(user);
            validTokens.add(token);

            return h.response({
                data: {
                    userId: snapshot.docs[0].id, // Mengambil ID dokumen dari hasil query
                    name: user.name,
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
