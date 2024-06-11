const Hapi = require('@hapi/hapi');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const textRoutes = require('./routes/textRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT || 3000 
});

// Add routes
server.route([...authRoutes, ...userRoutes]);

// Start the server
async function start() {
    try {
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
