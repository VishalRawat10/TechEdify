const { queryMessageSchema } = require("../config/joiSchema.config");
const QueryMessage = require("../models/queryMessage");
const ExpressError = require("../utils/ExpressError");

module.exports.getQueryMessages = async (req, res, next) => {
    const queryMessages = await QueryMessage.find({ isResolved: false });

    return res.status(200).json({ message: "QueryMessages fetched successfully!", queryMessages });
}

module.exports.postQueryMessage = async (req, res, next) => {

    const { fullname, email, queryMessage } = req.body;

    const { error } = queryMessageSchema.validate({ fullname, email, queryMessage });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    const newQueryMessage = new QueryMessage({ fullname, email, queryMessage });

    await newQueryMessage.save();

    return res.status(201).json({ message: "Your query sent successfully!" });

}

module.exports.updateResolvedStatus = async (req, res, next) => {
    const { id } = req.params;

    const { isResolved } = req.body;

    const queryMessage = await QueryMessage.findByIdAndUpdate(id, { isResolved }, { new: true });

    if (!queryMessage) {
        return next(new ExpressError(400, "Query Message not found!"));
    }

    return res.status(200).json({ queryMessage });
}