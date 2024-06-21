const pdfParse = require('pdf-parse');
const { analyzeGrammar } = require('../models/grammar');

// Fungsi untuk melakukan preprocessing pada teks
const preprocessText = (text) => {
    
    const normalizedText = text.toLowerCase();
    const tokens = normalizedText.split(/\s+/); 


    return tokens; 
};

const uploadAndAnalyzePDF = async (request, h) => {
    const { file } = request.payload;

    try {
        // Ekstraksi teks dari PDF
        const data = await pdfParse(file._data);
        const text = data.text;

        // Preprocessing teks
        const tokens = preprocessText(text);

        // Analisis grammar menggunakan model ML
        const grammarAnalysisResult = analyzeGrammar(tokens);

        return h.response({
            message: 'PDF uploaded and grammar analyzed successfully',
            originalText: text,
            grammarAnalysis: grammarAnalysisResult,
        }).code(200);
    } catch (error) {
        console.error('Error during PDF upload and grammar analysis:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    uploadAndAnalyzePDF,
};
