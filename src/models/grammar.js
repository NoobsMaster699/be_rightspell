// Fungsi untuk melakukan analisis grammar sederhana
const analyzeGrammar = (tokens) => {
    const grammarErrors = [];

    tokens.forEach(token => {
        if (token === 'dont') {
            grammarErrors.push({
                token,
                message: 'Kata "dont" tidak sesuai aturan grammar.'
            });
        }
    });


    return grammarErrors;
};

module.exports = {
    analyzeGrammar,
};
