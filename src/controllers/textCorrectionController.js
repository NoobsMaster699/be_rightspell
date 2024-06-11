const correctText = async (request, h) => {
    try {
        const { text } = request.payload;

        // Logika dummy untuk koreksi teks
        const correctedText = text.replace('teh', 'the'); 

        return h.response({ correctedText }).code(200);
    } catch (error) {
        console.error('Error during text correction:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    correctText
};
