

const { googleSignIn, googleCallback, logout } = require('../controllers/authController');

module.exports = [
    {
        method: 'GET',
        path: '/auth/google',
        handler: googleSignIn,
        options: {
            tags: ['api'],
            description: 'Initiate Google OAuth sign-in',
        },
    },
    {
        method: 'GET',
        path: '/auth/google/callback',
        handler: googleCallback,
        options: {
            tags: ['api'],
            description: 'Callback URL for Google OAuth',
        },
    },
    {
        method: 'POST',
        path: '/logout',
        handler: logout,
        options: {
            tags: ['api'],
            description: 'Logout from the application',
        },
    },
];
