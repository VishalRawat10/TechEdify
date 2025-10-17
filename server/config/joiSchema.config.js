const Joi = require("joi");

module.exports.userSchema = Joi.object({
    email: Joi.string().email().required(),
    fullname: Joi.string().min(2).required(),
    DOB: Joi.date(),
    contact: Joi.string().min(10),
    address: Joi.string(),
    country: Joi.string(),
    about: Joi.string(),
})

module.exports.tutorSchema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    personalEmail: Joi.string().email().required(),
    message: Joi.string().min(20).required(),
    contact: Joi.string().min(10).required()
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

module.exports.queryMessageSchema = Joi.object({
    email: Joi.string().email().required(),
    fullname: Joi.string().min(2).required(),
    queryMessage: Joi.string().min(10).required()
});

module.exports.adminSchema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    personalEmail: Joi.string().email().required()
});