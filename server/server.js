require("dotenv").config();
const app = require("./app.js");
const { connectToDB } = require("./config/db.config.js");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { initializeSocket } = require("./socket/index.js");

const port = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL
    },
});

initializeSocket(io);

//Listening to the port============================================
server.listen(port, () => {
    console.log(`app is listening to port ${port}...`);
    //Connecting to mongoose
    connectToDB();
});


