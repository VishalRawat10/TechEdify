const mongoose = require("mongoose");

module.exports.main = async () => {
    return await mongoose.connect(process.env.MONGODB_URL);
}

