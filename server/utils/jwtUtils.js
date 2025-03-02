require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.generateJwt = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });

}

module.exports.verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}