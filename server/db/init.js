const mongoose = require("mongoose");
const Course = require("../models/course.js");
let { courses } = require("./data.js");

const initDB = async () => {
    await Course.deleteMany({});
    courses = courses.map((course) => (
        {
            ...course,
            teacher: '67837013cdd096c6b6cc8988'
        })
    );
    await Course.insertMany(courses);
    console.log("Db is initialised.");
}

const main = async () => {
    return await mongoose.connect("mongodb://localhost:27017/LearningPlatform");
}

main().then((res) => {
    console.log("Mongoose is connected successfully...");
})
    .catch((err) => {
        console.log(err);
    });

initDB();