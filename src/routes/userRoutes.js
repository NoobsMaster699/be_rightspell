const userController = require('../controllers/userController');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        options: {
            description: 'Register a new user',
            tags: ['api', 'user'],
            handler: userController.register,
            // Add Joi validation if needed
            // validate: {
            //     payload: Joi.object({
            //         // Define payload schema
            //     })
            // }
        }
    },
    {
        method: 'POST',
        path: '/login',
        options: {
            description: 'Login with existing user credentials',
            tags: ['api', 'user'],
            handler: userController.login,
            // Add Joi validation if needed
            // validate: {
            //     payload: Joi.object({
            //         // Define payload schema
            //     })
            // }
        }
    }
];
