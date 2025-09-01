const Joi = require("joi");

module.exports.tutorSchema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    personalEmail: Joi.string().email().required(),
    message: Joi.string().min(20).required(),
    // password: Joi.string().min(8).required()
});

module.exports.courseSchema = Joi.object({
    title: Joi.string().min(2).required(),
    alias: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(1).required(),
    chapters: Joi.string().required(),
    type: Joi.string().required()
});

module.exports.lectureSchema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    publicId: Joi.string().required(),
});