require("dotenv").config();
const app = require("./app.js");
const { main } = require("./services/db.js");
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//Listening to the port============================================
server.listen(port, () => {
    console.log(`app is listening to port ${port}...`);
    //Connecting to mongoose
    main().then((res) => {
        console.log("Mongoose is connected successfully...");
    })
        .catch((err) => {
            console.log(err);
        });
});


