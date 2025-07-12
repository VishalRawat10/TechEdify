const mongoose = require("mongoose");

module.exports.connectToDB = () => {
    mongoose.connect(process.env.MONGODB_URI).then((res) => {
        console.log("Mongoose is connected successfully...");
    }).catch((err) => {
        console.log(err);
    })
}

