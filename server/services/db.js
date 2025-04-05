const mongoose = require("mongoose");

const main = async () => {
    return await mongoose.connect(process.env.MONGODB_URL);
}

module.exports.connectToDB = async () => {
    main().then((res) => {
        console.log("Db in connected successfully...");
    }).catch((err) => {
        console.log(err);
    })
}

