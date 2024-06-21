// controllers/pdfController.js
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const { correctText } = require('../utils/correctText');

const uploadAndCorrectPDF = async (request, h) => {
    const { file } = request.payload;
    const filePath = path.join(__dirname, '../uploads', file.hapi.filename);

    try {
        const fileStream = fs.createWriteStream(filePath);
        file.pipe(fileStream);

        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        const correctedText = correctText(text);
        const correctedFilePath = path.join(__dirname, '../uploads', `corrected-${file.hapi.filename}`);
        fs.writeFileSync(correctedFilePath, correctedText);

        return h.response({
            message: 'PDF extracted successfully',
            text: correctedText,
            correctedFilePath,
        }).code(200);
    } catch (error) {
        console.error('Error during PDF upload and correction:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    } finally {
        fs.unlinkSync(filePath);
    }
};

module.exports = {
    uploadAndCorrectPDF,
};
