import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ChatInput,
  Message,
  SearchBox,
  ResultCard,
} from "../../components/DiscussionComponents";
import { getDateAndTime, getDate } from "../../services/utils";
import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";

export default function DiscussionsPage() {
  const { user, socket, unreadMessages } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);

  const messagesContainer = useRef(null);

  const [messages, setMessages] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [discussionChat, setDiscussionChat] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [createNewDiscussion, setCreateNewDiscussion] = useState(false);
  const [undiscussedTutors, setUndiscussedTutors] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [disRes, tutorRes] = await Promise.all([
          apiInstance.get("/users/discussions"),
          apiInstance.get("/users/undiscussed-tutors"),
        ]);
        setDiscussions(disRes.data.discussions);
        setUndiscussedTutors(tutorRes.data.undiscussedTutors || []);
      } catch (err) {
        setMessageInfo(
          err.response?.data?.message || "Couldn't load discussions!",
          true
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!discussionChat) return;

    const getMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await apiInstance.get(
          `/users/discussions/${discussionChat._id}/messages`
        );
        setMessages(res.data.messages);
      } catch (err) {
        setMessageInfo("Couldn't fetch the messages!");
      }
      setLoadingMessages(false);
    };

    if (discussionChat._id) {
      getMessages();
    }

    // receive message event
    socket.on("receive-message", (receivedMessage) => {
      if (discussionChat._id !== receivedMessage.discussion._id) return;
      socket.emit("mark-read", {
        memberId: user._id,
        messageId: receivedMessage._id,
      });
      // update last message in current discussion
      setDiscussionChat((prev) =>
        prev ? { ...prev, lastMessage: receivedMessage } : prev
      );
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [discussionChat]);

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  }, [messages.length]);

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

      return () => {
        socket.off("delete-message");
        socket.off("join-discussion");
      };
    }
  }, [socket]);

  const openDiscussion = (discussion) => {
    const disUnreadMsgs = unreadMessages.filter((msg) => {
      return (
        msg.discussion === discussion._id ||
        msg.discussion._id === discussion._id
      );
    });

    disUnreadMsgs.forEach((msg) => {
      socket.emit("mark-read", { messageId: msg._id, memberId: user._id });
    });

    setDiscussionChat(discussion);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      setMessage("");
      socket.emit("send-message", {
        discussionId: discussionChat._id,
        isTutor: false,
        sender: {
          _id: user._id,
          profileImage: user.profileImage,
          fullname: user.fullname,
        },
        //
        receiver:
          discussionChat.type === "private"
            ? discussionChat.members.find((m) => m.member._id !== user._id)
                ?.member
            : null,
        message,
      });
    }
  };

  const handleClickMessage = (tutor) => {
    setDiscussionChat({
      type: "private",
      members: [{ member: tutor, memberModel: "Tutor" }],
    });
    setMessages([]);
    setCreateNewDiscussion(false);
  };

  const handleDeleteMessage = (message) => {
    socket.emit("delete-message", { message, authorId: user._id });
  };

  return (
    <main className="w-full flex justify-center h-[calc(100vh-var(--header-h))]">
      {/* Sidebar */}
      <section
        className={`w-full flex flex-col gap-6 py-4 ${
          discussionChat && "hidden"
        } lg:flex lg:w-1/4 lg:h-full lg:border-r-1 lg:border-r-gray-400 lg:dark:border-r-gray-600`}
      >
        <div className="flex justify-between items-center px-3">
          <h3 className="text-2xl">Discussions</h3>
          <button
            className="flex items-center justify-center p-2 aspect-square rounded-lg text-white bg-main cursor-pointer hover:opacity-80"
            onClick={() => setCreateNewDiscussion(true)}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>

        <div className="flex flex-col gap-2 h-[calc(100vh-var(--header-h)-2rem)] overflow-auto scrollbar-none px-1">
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

            return (
              <button
                className={`flex gap-2 items-center hover:bg-black/10 hover:dark:bg-white/10 p-3 cursor-pointer rounded-lg ${
                  discussion._id === discussionChat?._id &&
                  "bg-black/10 dark:bg-white/10"
                }`}
                onClick={() => openDiscussion(discussion)}
                key={discussion._id}
              >
                <img
                  src={
                    discussion.type === "private"
                      ? discussion.members[0].member.profileImage.url
                      : discussion.course.thumbnail.url || "/images/User.png"
                  }
                  alt=""
                  className="h-12 rounded-full aspect-square object-cover"
                />
                <div className="text-left text-sm lg:text-xs">
                  <p>
                    {discussion.type === "private"
                      ? discussion.members[0].member.fullname
                      : discussion.course.title}
                  </p>
                  <span className="flex gap-2 text-xs lg:text-[10px]">
                    <p className="text-main ">
                      {lastMessage &&
                        (lastMessage.sender._id === user._id
                          ? "You:"
                          : lastMessage.sender.fullname + ":")}
                    </p>
                    {lastMessage && lastMessage.content}
                  </span>
                </div>
                {unreadMsgsCount !== 0 && (
                  <p className=" flex items-center ml-auto bg-[#f34646] text-xs text-white px-1 rounded-full">
                    {unreadMsgsCount}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {discussionChat ? (
        <section className="w-full mt-2 lg:w-3/4">
          <div className="w-full h-[4rem] flex gap-2 items-center px-2 border-b-1 border-b-gray-400 dark:border-b-gray-600 ">
            <ArrowBackIcon
              className="cursor-pointer"
              onClick={() => setDiscussionChat(null)}
            />
            <img
              src={
                discussionChat.type === "private"
                  ? discussionChat.members[0].member.profileImage.url ||
                    "/images/User.png"
                  : discussionChat.course.thumbnail.url || "/images/User.png"
              }
              alt=""
              className="h-12 rounded-full aspect-square object-cover"
            />
            <p>
              {discussionChat.type === "private"
                ? discussionChat.members[0].member.fullname
                : discussionChat.course.title}
            </p>
          </div>

          <div className="flex flex-col min-h-[calc(100vh-9rem)] py-4 gap-2">
            <div
              className="w-full px-2 flex flex-col gap-1 overflow-auto h-[calc(100vh-15rem)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400"
              ref={messagesContainer}
            >
              {discussionChat.type === "course" && (
                <p className=" text-center text-xs">
                  Created on {getDateAndTime(discussionChat.createdAt)}
                </p>
              )}

              {loadingMessages && (
                <span className="text-[12px] text-main flex flex-col gap-2 items-center justify-center">
                  <CircularProgress size={"1rem"} />
                  <p>Loading...</p>
                </span>
              )}

              {messages.map((msg, idx) => {
                const currMsgDate = getDate(msg.createdAt);
                const prevMsgDate =
                  idx !== 0 ? getDate(messages[idx - 1].createdAt) : null;
                const dateChanged = currMsgDate !== prevMsgDate;
                const isContinuous =
                  idx > 0 &&
                  !dateChanged &&
                  msg.sender._id === messages[idx - 1].sender._id;

                return (
                  <div key={msg._id || idx}>
                    {dateChanged && (
                      <p className="w-full text-center text-[11px] my-2 text-main font-semibold">
                        {currMsgDate}
                      </p>
                    )}
                    <Message
                      message={msg.content}
                      date={msg.createdAt}
                      senderName={msg.sender.fullname}
                      isMe={msg.sender._id === user._id}
                      isContinuous={isContinuous}
                      handleDeleteMessage={() => handleDeleteMessage(msg)}
                      senderImage={
                        msg.sender?.profileImage?.url || "/images/User.png"
                      }
                    />
                  </div>
                );
              })}
            </div>
            <form
              className="w-full px-2 mt-auto lg:px-6"
              onSubmit={sendMessage}
            >
              <ChatInput
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>
          </div>
        </section>
      ) : (
        <section className="hidden  w-3/4 h-[calc(100vh-4.5rem)] lg:flex items-center justify-center">
          <p className="text-3xl opacity-25">
            Click on a discussion to message!
          </p>
        </section>
      )}

      {/* New Discussion Modal */}
      {createNewDiscussion && (
        <section className="flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 bg-black/30 z-40 px-4">
          <div className="bg-light-card dark:bg-dark-card flex flex-col gap-8 rounded-xl px-6 py-12 relative w-full lg:p-12 lg:w-[34rem]">
            <button
              onClick={() => setCreateNewDiscussion(false)}
              className="cursor-pointer flex justify-center items-center bg-dark-card dark:bg-light-card text-white dark:text-black rounded-full w-8 aspect-square p-1  absolute -top-3 -right-2"
            >
              <CloseIcon fontSize="16px" />
            </button>
            <h3 className="text-center font-semibold text-xl">
              Discuss with Tutor
            </h3>
            <SearchBox
              placeholder="Type the tutor name..."
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col gap-2 h-[40vh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
              <h4 className="py-1 border-b-1 border-b-gray-300 dark:border-b-gray-700 font-semibold">
                Tutors
              </h4>
              {undiscussedTutors.map((tutor) => {
                if (
                  !search ||
                  tutor.fullname.toLowerCase().includes(search.toLowerCase())
                ) {
                  return (
                    <ResultCard
                      key={tutor._id}
                      person={tutor}
                      onClickMessage={handleClickMessage}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
