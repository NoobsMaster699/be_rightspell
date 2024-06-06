const userController = require('../controllers/userController');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: userController.register
    },
    {
        method: 'POST',
        path: '/login',
        handler: userController.login
    }
];
