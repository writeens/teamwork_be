//Import HTTp
const http = require('http');

//Import Express App
const app = require('./app');

//Set the port to listen on
app.set('port', process.env.PORT);

//Create the server
const server = http.createServer(app)

//Listen on port for server
server.listen(process.env.PORT || 3000)

module.exports = server