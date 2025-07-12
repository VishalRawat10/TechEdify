const Message = require("../models/message");

//get-messages from contact page
module.exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        return res.status(200).json({ message: "Messages fetched successfully.", messages });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error! Unable to fetch messages.", error: err.message });
    }
}

module.exports.send = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    } const { fullname, email, message } = req.body;
    try {
        const newMessage = new Message({
            fullname,
            email,
            message
        });
        await newMessage.save();
        res.status(200).json({ message: "Your message is sent." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}