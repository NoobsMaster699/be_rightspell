const { google } = require('googleapis');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { oauth2Client, validTokens } = require('../config/firebase');
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
          return h.response({ message: 'Invalid user data' }).code(400);
      }

      const userCollection = admin.firestore().collection('users');
      const userQuery = await userCollection.where('email', '==', data.email).limit(1).get();

      let userRef;
      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      if (userQuery.empty) {
          userRef = userCollection.doc();
          await userRef.set({
              email: data.email,
              name: data.name,
              photo: data.picture || null,
              createdAt: timestamp,
              updatedAt: timestamp
          });
      } else {
          userRef = userQuery.docs[0].ref;
          await userRef.update({
              name: data.name,
              photo: data.picture || null,
              updatedAt: timestamp
          });
      }

      const token = generateToken({ id: userRef.id, email: data.email, name: data.name, photo: data.picture });
      validTokens.add(token);

      return h.response({
          data: { id: userRef.id, email: data.email, name: data.name, photo: data.picture },
          token
      }).code(200);
  } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
  }
};

  

// Logout Handler
const logout = (request, h) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return h.response({ message: 'Authorization header missing' }).code(403);
    }

    const token = authHeader.split(' ')[1];
    if (!validTokens.has(token)) {
        return h.response({ message: 'Invalid token' }).code(403);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        validTokens.delete(token);

        return h.response({ message: 'Logout successful', userId: decoded.id }).code(200);
    } catch (error) {
        console.error('Error during logout:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    googleSignIn,
    googleCallback,
    logout
};
