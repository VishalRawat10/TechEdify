import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Add from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress } from "@mui/material";

import { TutorContext } from "../../context/TutorContext";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";
import { getDate, getDateAndTime } from "../../services/utils";
import {
  ChatInput,
  Message,
  SearchBox,
  ResultCard,
} from "../../components/DiscussionComponents";

export default function DiscussionsPage() {
  const { tutor, setIsLoading, socket, isLoading, unreadMessages } =
    useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  const [undiscussedCourses, setUndiscussedCourses] = useState([]);
  const [undiscussedStudents, setUndiscussedStudents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [discussionChat, setDiscussionChat] = useState();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesContainer = useRef(null);
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [res1, res2, res3] = await Promise.all([
          apiInstance.get("/tutors/discussions"),
          apiInstance.get("/tutors/courses/undiscussed"),
          apiInstance.get("/tutors/undiscussed-users"),
        ]);
        setDiscussions(res1.data.discussions);
        setUndiscussedCourses(res2.data.undiscussedCourses);
        setUndiscussedStudents(res3.data.undiscussedUsers);
      } catch (err) {
        setMessageInfo("Failed to load discussions data!");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!discussionChat?._id) {
      return;
    }
    const getMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await apiInstance.get(
          `/tutors/discussions/${discussionChat._id}/messages`
        );

        setMessages(res.data.messages);
      } catch (err) {
        setMessageInfo("Couldn't load messages!");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();

    socket.on("receive-message", (receivedMessage) => {
      if (discussionChat._id !== receivedMessage.discussion._id) return;
      socket.emit("mark-read", {
        messageId: receivedMessage._id,
        memberId: tutor._id,
      });
      setMessages((prev) => [...prev, receivedMessage]);
      setSendingMsg(false);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [discussionChat]);

  useEffect(() => {
    if (socket) {
      socket.on("join-discussion", (discussion) => {
        setDiscussions((prev) => [...prev, discussion]);
        socket.emit("join-discussion", discussion._id);
      });

      socket.on("delete-message", (message) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== message._id)
        );
      });

      socket.on("add-discussion", (discussion) => {
        setIsLoading(false);
        setDiscussions((prev) => [...prev, discussion]);
        setDiscussionChat(discussion);
      });

      socket.on("message-sent", (message) => {
        setSendingMsg(false);
      });

      socket.on("discusion-created", (discussion) => {
        setDiscussionChat(discussion);
        setDiscussions((prev) => [...prev, discussion]);
      });

      return () => {
        socket.off("add-discussion");
        socket.off("join-discussion");
        socket.off("message-sent");
        socket.off("delete-message");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  }, [messages]);

  const openDiscussion = (discussion) => {
    const newDiscMsgs = unreadMessages.filter((msg) => {
      if (
        msg.discussion == discussion._id ||
        msg.discussion?._id === discussion._id
      ) {
        return true;
      }
      return false;
    });

    newDiscMsgs.forEach((msg) => {
      socket.emit("mark-read", {
        memberId: tutor._id,
        messageId: msg._id,
      });
    });

    setDiscussionChat(discussion);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    setMessage("");
    socket.emit("send-message", {
      message,
      isTutor: true,
      sender: {
        _id: tutor._id,
        fullname: tutor.fullname,
        profileImgae: tutor.profileImage,
      },
      discussionId: discussionChat._id,
      receiver: !discussionChat._id && discussionChat.members[1].member,
    });
    setSendingMsg(true);
  };

  const handleDeleteMessage = (message) => {
    socket.emit("delete-message", { message, authorId: tutor._id });
  };

  //New Discussion Functions
  const handleClickCreate = (course) => {
    setIsLoading(true);
    socket.emit("create-discussion", { course, tutorId: tutor._id });
    setShowCreateDiscussion(false);
  };

  const handleClickMessage = (user) => {
    const members = [];
    members[1] = { member: user, memberModel: "User" };
    setDiscussionChat({
      type: "private",
      members: members,
    });
    setMessages([]);
    setShowCreateDiscussion(false);
  };

  return (
    <div className="flex w-full h-[calc(100vh-4.5rem)]">
      {/*Discussion list and sidebar  */}
      <div
        className={`py-5 w-full flex ${
          discussionChat && "hidden lg:flex"
        } flex-col gap-4 lg:border-r-1 lg:border-r-gray-300 lg:dark:border-r-gray-600  lg:w-[20rem]`}
      >
        {/* heading  */}
        <div className="flex w-full justify-between px-4">
          <h1 className="text-2xl">Discussions</h1>
          <button
            onClick={() => setShowCreateDiscussion(true)}
            className="flex items-center justify-center p-2 aspect-square rounded-lg text-white bg-main cursor-pointer hover:opacity-80"
          >
            <Add fontSize="small" />
          </button>
        </div>

        {/* all discussions */}
        <div className="flex flex-col gap-1">
          {discussions.map((discussion) => {
            let lastMessage = discussion.lastMessage;
            const unreadMsgsCount = unreadMessages.reduce((count, msg) => {
              if (
                msg.discussion === discussion._id ||
                msg.discussion?._id === discussion._id
              ) {
                lastMessage = msg;
                return count + 1;
              }
              return count;
            }, 0);

            const discussionImg =
              discussion.type === "course"
                ? discussion?.course?.thumbnail?.url
                : discussion.members[1].member?.profileImage?.url ||
                  "/images/User.png";
            return (
              <button
                key={uuidv4()}
                className={`cursor-pointer w-full flex items-center text-left gap-2 text-sm p-2 px-4 hover:bg-black/10 dark:hover:bg-white/10 ${
                  discussion?._id.toString() ===
                    discussionChat?._id?.toString() &&
                  "bg-black/10 dark:bg-white/10"
                } lg:text-xs`}
                onClick={() => openDiscussion(discussion)}
              >
                <img
                  src={discussionImg}
                  loading="lazy"
                  className="h-12 rounded-full aspect-square object-cover"
                />
                <div className="text-left">
                  {/* discussion name  */}
                  <p>
                    {discussion.type === "private"
                      ? discussion.members[1].member.fullname
                      : discussion.course.title}
                  </p>
                  {/* discussion last message */}
                  <span className="flex gap-2 text-xs lg:text-[10px]">
                    <p className="text-main ">
                      {lastMessage &&
                        (lastMessage.sender._id == tutor._id
                          ? "You:"
                          : lastMessage.sender.fullname + ":")}
                    </p>
                    {lastMessage && lastMessage.content}
                  </span>
                </div>
                {unreadMsgsCount != 0 && (
                  <p className=" flex items-center ml-auto bg-[#f34646] text-xs text-white px-1 rounded-full">
                    {unreadMsgsCount}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* discussion chat  */}
      <div
        className={`absolute flex flex-col w-full top-0 z-10 bg-light dark:bg-dark h-screen lg:min-h-[calc(100vh-4.5rem)] pb-4 ${
          !discussionChat && "hidden"
        } lg:flex lg:flex-col lg:static lg:w-[calc(100%-20rem)] `}
      >
        {discussionChat ? (
          <>
            {/* Upper heading  */}
            <div className="flex w-full gap-2 items-center border-b-1 border-b-gray-300 dark:border-b-gray-600 h-[5rem] lg:h-[4rem] py-2 px-4 ">
              <button
                className="flex items-center justify-center cursor-pointer"
                onClick={() => setDiscussionChat()}
              >
                <ArrowBackIcon />
              </button>
              <img
                src={
                  discussionChat?.course?.thumbnail?.url ||
                  discussionChat?.members[1].member?.profileImage?.url ||
                  "/images/User.png"
                }
                alt=""
                loading="lazy"
                className="h-12 rounded-full aspect-square object-cover"
              />
              <div className="text-xm">
                {discussionChat?.course?.title ||
                  discussionChat?.members[1].member.fullname}
              </div>
            </div>

            {/* Chat container */}
            <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2 lg:h-[calc(100vh-9.5rem)]">
              {/* messages Conatainer  */}
              <div
                className="w-full flex flex-col gap-1 overflow-auto h-[calc(100vh-9rem)] lg:h-[calc(100vh-11rem)] px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 pt-2"
                ref={messagesContainer}
              >
                {discussionChat.type === "course" && (
                  <p className=" flex text-[12px] w-full justify-center text-center">
                    Created on {getDateAndTime(discussionChat?.createdAt)}
                  </p>
                )}

                {/* All messages  */}
                {messages.map((message, idx) => {
                  const currMsgDate = getDate(message.createdAt);
                  const prevMsgDate =
                    idx != 0 ? getDate(messages[idx - 1].createdAt) : null;
                  const dateChanged = currMsgDate != prevMsgDate;

                  const isContinuous =
                    idx === 0
                      ? false
                      : message.sender._id === messages[idx - 1].sender._id;
                  return (
                    <>
                      {dateChanged && (
                        <div
                          className="w-full text-center text-[11px] text-main font-semibold"
                          key={uuidv4()}
                        >
                          {currMsgDate}
                        </div>
                      )}
                      <Message
                        message={message.content}
                        date={message.createdAt}
                        senderName={message.sender.fullname}
                        isMe={
                          message.isTutor || message.sender._id === tutor._id
                        }
                        senderImage={
                          message.sender?.profileImage?.url ||
                          "/images/User.png"
                        }
                        key={uuidv4()}
                        isContinuous={isContinuous && !dateChanged}
                        handleDeleteMessage={() => handleDeleteMessage(message)}
                      />
                    </>
                  );
                })}
                {(loadingMessages || sendingMsg) && (
                  <span className="text-[12px] text-main flex flex-col gap-2 items-center justify-center">
                    <CircularProgress size={"1rem"} />
                    <p>Loading...</p>
                  </span>
                )}
              </div>
              {/* message input box  */}
              <form
                className="px-4 mt-auto w-full"
                onSubmit={handleSendMessage}
              >
                <ChatInput
                  placeholder={"Write your message..."}
                  className=""
                  value={message}
                  disabled={loadingMessages || isLoading}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
              </form>
            </div>
          </>
        ) : (
          <div className="hidden  w-full h-[calc(100vh-4.5rem)] lg:flex items-center justify-center">
            <p className="text-3xl opacity-25">
              Click on a discussion to message!
            </p>
          </div>
        )}
      </div>

      {/* Create Discussion or message student  */}
      {showCreateDiscussion && (
        <div className="flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 bg-black/30 z-40 px-4">
          <div className="bg-light-card dark:bg-dark-card flex flex-col gap-8 rounded-xl px-6 py-12 relative w-full lg:p-12 lg:w-[34rem]">
            <button
              onClick={() => setShowCreateDiscussion(false)}
              className="cursor-pointer flex justify-center items-center bg-dark-card dark:bg-light-card text-white dark:text-black rounded-full w-8 aspect-square p-1  absolute -top-3 -right-2"
            >
              <CloseIcon fontSize="16px" />
            </button>
            <h3 className="text-center font-semibold text-xl">
              Create new discussion
            </h3>
            <SearchBox
              placeholder="Type the course or student by name..."
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col gap-4 h-[40vh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
              {/* Courses Result Container  */}
              <div className="flex flex-col gap-2 ">
                <h4 className="py-1 border-b-1 border-b-gray-300 dark:border-b-gray-700 font-semibold">
                  Courses
                </h4>
                {undiscussedCourses.map((course) => {
                  if (search.length) {
                    if (
                      course.title.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return (
                        <ResultCard
                          key={uuidv4()}
                          course={course}
                          onClickCreate={handleClickCreate}
                        />
                      );
                    }
                  } else
                    return (
                      <ResultCard
                        key={uuidv4()}
                        course={course}
                        onClickCreate={handleClickCreate}
                      />
                    );
                })}
              </div>
              {/* Users Result Container  */}
              <div>
                <h4 className="py-1 border-b-1 border-b-gray-300 dark:border-b-gray-700 font-semibold">
                  Students
                </h4>
                {undiscussedStudents.map((student) => {
                  if (search.length) {
                    if (
                      student.fullname
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return (
                        <ResultCard
                          key={uuidv4()}
                          person={student}
                          onClickMessage={handleClickMessage}
                        />
                      );
                    }
                  } else
                    return (
                      <ResultCard
                        key={uuidv4()}
                        person={student}
                        onClickMessage={handleClickMessage}
                      />
                    );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
