const { validationResult } = require("express-validator");
const Lecture = require("../models/lecture");

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

    const { title, lectureUrl, description, thumbnailUrl } = req.body;
    try {
        const lecture = new Lecture({
            courseId: req.course._id,
            title,
            lectureVideo: {
                filename: "",
                url: lectureUrl
            },
            description,
            thumbnail: thumbnailUrl,
            instructorId: req.user._id
        });

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