const { google } = require('googleapis');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://backend-dot-test-69-424605.et.r.appspot.com/auth/google/callback'

);

const validTokens = new Set();

module.exports = {
    admin,
    oauth2Client,
    validTokens
};
