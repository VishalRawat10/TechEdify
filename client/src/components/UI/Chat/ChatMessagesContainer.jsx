import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatMessagesContainer({ chats, isLoading }) {
  const messageContainer = useRef();
  useEffect(() => {
    messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
  }, [chats]);
  return (
    <section
      className="flex flex-col h-full overflow-y-auto gap-4 px-4 scrollbar-thin dark:scrollbar-thumb-white/30 scrollbar-thumb-black/30 scrollbar-track-transparent relative"
      ref={messageContainer}
    >
      {!chats?.length ? (
        <div className="text-2xl md:text-5xl font-semibold opacity-20 my-auto flex flex-col md:flex-row items-center justify-center gap-2">
          <img src="/images/chat.png" className="h-24" />
          <p>Ask your doubt to AI</p>
        </div>
      ) : (
        ""
      )}

      {chats?.length
        ? chats?.map((chat, idx) => (
            <ChatMessage
              key={idx}
              message={chat.message}
              sender={chat.sender}
              incoming={chat.incoming}
              isLoading={isLoading}
            />
          ))
        : ""}
    </section>
  );
}
