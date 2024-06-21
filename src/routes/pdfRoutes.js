const pdfController = require('../controllers/pdfController');
const Joi = require('joi');
module.exports = [
    {
        method: 'POST',
        path: '/upload-pdf',
        options: {
            tags: ['api'], // Tag untuk Swagger
            description: 'Upload PDF and analyze grammar',
            notes: 'Uploads a PDF file, extracts text, preprocesses it, and analyzes grammar using an ML model.',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 10485760, // 10 MB
                multipart: true 
            },
            validate: {
                payload: Joi.object({
                    file: Joi.any()
                        .meta({ swaggerType: 'file' })
                        .description('PDF file to upload and analyze')
                })
            },
            response: {
                status: {
                    200: Joi.object({
                        message: Joi.string().description('Success message'),
                        originalText: Joi.string().description('Extracted text from PDF'),
                        grammarAnalysis: Joi.object().description('Result of grammar analysis')
                    }),
                    500: Joi.object({
                        message: Joi.string().description('Error message')
                    })
                }
            },
            handler: pdfController.uploadAndAnalyzePDF,
        }
    }
];
