const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')).required().messages({
        'any.required': 'Password is required',
        'string.pattern.base': 'Password must be at least 8 characters long and contain letters, numbers, and special characters.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Confirm password is required',
        'any.only': 'Passwords do not match'
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};
