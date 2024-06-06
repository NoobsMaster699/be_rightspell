const { google } = require('googleapis');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const oauth2Client = require('../config/firebase').oauth2Client;
const validTokens = require('../config/firebase').validTokens;
const generateToken = require('../utils/generateToken');

// Google OAuth Sign-in Handler
const googleSignIn = (request, h) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
        include_granted_scopes: true,
    });

    return h.redirect(authorizationUrl);
};

// Google OAuth Callback Handler
const googleCallback = async (request, h) => {
    try {
        const { code } = request.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data } = await oauth2.userinfo.get();

        if (!data.email || !data.name) {
            return h.response({ data }).code(400);
        }

        const userRef = admin.firestore().collection('users').doc(data.email);
        await userRef.set({
            name: data.name,
            email: data.email,
            address: "-",
        });

        const user = {
            email: data.email,
            name: data.name,
            address: "-"
        };

        const token = generateToken(user);
        validTokens.add(token);

        return h.response({
            data: user,
            token
        }).code(200);
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

// Logout Handler
const logout = (request, h) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (token && validTokens.has(token)) {
        validTokens.delete(token);
        return h.response({ message: 'Logout successful' }).code(200);
    } else {
        return h.response({ message: 'Invalid token' }).code(403);
    }
};

module.exports = {
    googleSignIn,
    googleCallback,
    logout
};
