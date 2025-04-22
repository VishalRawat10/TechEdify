import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import ChatMessageInputBox from "../components/UI/Chat/ChatMessageInputBox";
import ChatMessagesContainer from "../components/UI/Chat/ChatMessagesContainer";

export default function ChatBotPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats"));
    if (savedChats?.length) {
      return savedChats;
    } else return [];
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  return (
    <main className="px-4 md:px-[14rem] py-8 h-[calc(100vh-var(--header-h))] flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-3xl flex gap-2 items-center">
          <img src="/images/chat.png" className="h-6" />
          AI CHAT
        </h1>
        <button
          className="cursor-pointer opacity-50 hover:opacity-100"
          title="clear chat"
          onClick={() => setChats([])}
        >
          <DeleteIcon />
        </button>
      </div>

      <ChatMessagesContainer
        chats={chats}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
      <ChatMessageInputBox
        chats={chats}
        setChats={setChats}
        setIsLoading={setIsLoading}
      />
    </main>
  );
}
