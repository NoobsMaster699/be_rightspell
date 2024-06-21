const Joi = require('joi');
const userController = require('../controllers/userController');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        options: {
            description: 'Register a new user',
            notes: 'Registers a new user with name, email, password, and confirm password',
            tags: ['api', 'user'],
            handler: userController.register,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().description('Name of the user'),
                    email: Joi.string().email().required().description('Email of the user'),
                    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')).required().description('Password for the user'),
                    confirmPassword: Joi.string().required().description('Confirm password')
                })
            },
            response: {
                status: {
                    201: Joi.object({
                        message: Joi.string().example('User created'),
                        userId: Joi.string().example('some-user-id'),
                        token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
                    }),
                    400: Joi.object({
                        message: Joi.string().example('Validation failed'),
                        errors: Joi.array().items(Joi.string().example('Email is required'))
                    }),
                    500: Joi.object({
                        message: Joi.string().example('Internal Server Error')
                    })
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/login',
        options: {
            description: 'Login with existing user credentials',
            notes: 'Logs in an existing user with email and password',
            tags: ['api', 'user'],
            handler: userController.login,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().description('Email of the user'),
                    password: Joi.string().required().description('Password for the user')
                })
            },
            response: {
                status: {
                    200: Joi.object({
                        data: Joi.object({
                            userId: Joi.string().example('some-user-id'),
                            name: Joi.string().example('John Doe'),
                            email: Joi.string().example('john.doe@example.com')
                        }),
                        token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
                    }),
                    403: Joi.object({
                        message: Joi.string().example('Incorrect password')
                    }),
                    404: Joi.object({
                        message: Joi.string().example('User not found')
                    }),
                    500: Joi.object({
                        message: Joi.string().example('Internal Server Error')
                    })
                }
            }
        }
    }
];
