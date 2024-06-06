const Hapi = require('@hapi/hapi');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Create a new Hapi server instance
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
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
