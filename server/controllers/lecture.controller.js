const { validationResult } = require("express-validator");
const Lecture = require("../models/lecture");
const cloudinary = require("cloudinary").v2;

//get-lectures
module.exports.getLectures = async (req, res, next) => {
    try {
        return res.status(200).json({ message: "lectures fetched successfully!", course: req.course });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error!", success: false, error: err.message });
    }
}

//create lecture
module.exports.addLecture = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }

    const { title, description } = req.body;
    try {

        console.log(req.files);
        const lecture = new Lecture({
            courseId: req.course._id,
            title,
            description,
            instructorId: req.user.instructorId
        });

        req.files.forEach((file) => {
            lecture[file.fieldname].url = file.path;
            lecture[file.fieldname].filename = file.filename;

        })
        console.log(lecture);

        req.course.lectures.push(lecture);
        await req.course.save();
        await lecture.save();
        return res.status(201).json({ message: "Lecture added successfully!", success: true })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", succes: false });
    }
}

//Destroy


//Update