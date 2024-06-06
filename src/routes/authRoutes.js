const authController = require('../controllers/authController');

module.exports = [
    {
        method: 'GET',
        path: '/auth/google',
        handler: authController.googleSignIn
    },
    {
        method: 'GET',
        path: '/auth/google/callback',
        handler: authController.googleCallback
    },
    {
        method: 'GET',
        path: '/logout',
        handler: authController.logout
    }
];
