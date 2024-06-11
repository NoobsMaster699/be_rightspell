const textCorrectionController = require('../controllers/textCorrectionController');

module.exports = [
    {
        method: 'POST',
        path: '/correct-text',
        handler: textCorrectionController.correctText
    }
];
