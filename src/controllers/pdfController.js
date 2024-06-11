const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const { correctText } = require('../utils/correctText'); // Fungsi untuk mengoreksi teks

const uploadAndCorrectPDF = async (request, h) => {
    const file = request.payload.file;
    const filePath = path.join(__dirname, '../uploads', file.hapi.filename);

    try {
        // Save file to server
        const fileStream = fs.createWriteStream(filePath);
        file.pipe(fileStream);

        // Wait for file to be fully saved
        await new Promise((resolve, reject) => {
            file.on('end', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Read and parse PDF
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        // Correct text
        const correctedText = correctText(text);

        // Save corrected text to new PDF (optional)
        const correctedFilePath = path.join(__dirname, '../uploads', `corrected-${file.hapi.filename}`);
        fs.writeFileSync(correctedFilePath, correctedText);

        return h.response({
            message: 'PDF corrected successfully',
            correctedText,
            correctedFilePath,
        }).code(200);
    } catch (error) {
        console.error('Error during PDF upload and correction:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    } finally {
        // Cleanup: remove uploaded file
        fs.unlinkSync(filePath);
    }
};

module.exports = {
    uploadAndCorrectPDF,
};
