const User = require("../models/user");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const Discussion = require('../models/discussion');
const Message = require('../models/message');

module.exports.initializeSocket = (io) => {

    const onlineTutors = new Map();
    const onlineUsers = new Map();

    io.on("connection", (socket) => {

        console.log("Socket has connected : ", socket.id);

        //connecting -user
        socket.on("connect-user", async (userId) => {
            try {
                onlineUsers.set(userId, socket.id);

                const discussions = await Discussion.find({ "members.member": userId });
                discussions.forEach((discussion) => {
                    socket.join(discussion._id.toString());
                    console.log("User joined discussion: ", discussion._id);
                });
            } catch (err) {
                console.log(err);
                socket.emit("error", { error: "Couldn't connect to server!" });
            }
        });

        // connecting tutor 
        socket.on("connect-tutor", async (tutorId) => {
            try {
                onlineTutors.set(tutorId, socket.id);

                const discussions = await Discussion.find({ "members.member": tutorId });
                discussions.forEach((discussion) => {
                    socket.join(discussion._id.toString());
                    console.log("Tutor joined discussion: ", discussion._id);
                });
            } catch (err) {
                console.log(err);
                socket.emit("error", { error: "Couldn't connect to server!" });
            }
        });

        //send message
        socket.on("send-message", async ({ discussionId, isTutor, sender, receiver, message: content }) => {
            // checking if the sender is online or not 
            if (isTutor) {
                if (!onlineTutors.has(sender._id)) { console.log(`Tutor ${sender.fullname} is not online.`); return; }
            } else {
                if (!onlineUsers.has(sender._id)) { console.log(`User ${sender.fullname} is not online.`); return; }
            }

            let discussion;

            // Create new discussion if discussionId does not exist 
            if (!discussionId) {
                discussion = new Discussion({
                    type: "private",
                    members: [{ member: isTutor ? sender._id : receiver._id, memberModel: "Tutor" }, { member: isTutor ? receiver._id : sender._id, memberModel: "User" }]
                });
                await discussion.save();
                await discussion.populate("members.member", "fullname profileImage");

                socket.join(discussion._id.toString());
                const receiverSocketId = isTutor ? onlineUsers.get(receiver._id) : onlineTutors.get(receiver._id);
                socket.to(receiverSocketId).emit("join-discussion", discussion);
            } else {
                // checking if the discussion exists or not 
                discussion = await Discussion.findById(discussionId).populate("members.member", "fullname profileImage");
                if (!discussion) return;
            }

            // checking if the sender is member of discussion 
            const isMember = discussion.members.map((member) => { return member.member._id.toString() }).includes(sender._id.toString());
            if (!isMember) {
                console.log(`${sender.fullname} is not he member of discussion: ${discussionId}`);
                return;
            }

            // saving message to db 
            const message = new Message({
                sender: sender._id,
                senderModel: isTutor ? "Tutor" : "User",
                discussion: discussion._id,
                content,
                isTutor,
            });
            await message.save();

            //updating the last message 
            discussion.lastMessage = message._id;
            discussion.save();

            await message.populate("sender", "fullname profileImage");
            await message.populate({ path: "discussion", populate: { path: "course", select: "title thumbnail" } });

            //sending message to all the members of discussion including the sender
            io.to(discussion._id.toString()).emit("receive-message", message);

            //sending newMessage to all the members of discussion excluding the sender
            socket.to(discussion._id.toString()).emit("new-message", message);
        });

        //Marking message as read
        socket.on("mark-read", async ({ messageId, memberId }) => {

            const message = await Message.findByIdAndUpdate(
                messageId,
                { $push: { readBy: memberId } },
                { new: true }
            );
            socket.emit("mark-read", message);
        });

        //Join new discussion
        socket.on("join-discussion", (discussionId) => {
            socket.join(discussionId.toString());
            console.log("User joined the discussion : ", discussionId);
        });

        // Delete message 
        socket.on("delete-message", async ({ message, authorId }) => {

            if (!message || !authorId) return console.log("Message or authoId can't be null!");

            if (authorId === message.sender._id) {
                await Message.findByIdAndDelete(message._id);
                io.to(message.discussion._id.toString()).emit("delete-message", message);
            } else {
                console.log(authorId + " is not the author of message.");
            }
        });

        //create discussion
        socket.on("create-discussion", async ({ course, tutorId }) => {

            const discussionCourse = await Course.findById(course._id).select("enrolledStudents");
            if (!discussionCourse) {
                return socket.emit("error", "Course not found!");
            }
            const discussion = new Discussion({
                course: course._id,
                type: "course",
                members: [{ member: tutorId, memberModel: "Tutor" }, ...discussionCourse.enrolledStudents.map((studentId) => {
                    return {
                        member: studentId,
                        memberModel: "User"
                    }
                })]
            });

            await discussion.save();
            await discussion.populate("course", "thumbnail title");

            socket.emit("join-discussion", discussion._id);
            discussion.members.map(({ member }) => {
                if (idx == 0) return;
                socket.to(onlineUsers.get(member)).emit("join-discussion", discussion._id);
            })

            socket.emit("add-discussion", discussion);
        })

        socket.on('disconnect', (reason) => {
            for (let [tutorId, sId] of onlineTutors.entries()) {
                if (sId === socket.id) onlineTutors.delete(tutorId);
            }
            for (let [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) onlineUsers.delete(userId);
            };
            console.log(`client ${socket.id} disconnected: ${reason}`);
        });
    });
}