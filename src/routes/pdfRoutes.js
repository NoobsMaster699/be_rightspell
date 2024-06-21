const pdfController = require('../controllers/pdfController');

module.exports = [
    {
        method: 'POST',
        path: '/upload-pdf',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 10485760, // 10 MB
                multipart: true 
            },
        },
        handler: pdfController.uploadAndCorrectPDF,
    }
];
