require("dotenv").config();
const app = require("./app.js");
const { connectToDB } = require("./config/db.config.js");
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//Listening to the port============================================
server.listen(port, () => {
    console.log(`app is listening to port ${port}...`);
    //Connecting to mongoose
    connectToDB();
});


