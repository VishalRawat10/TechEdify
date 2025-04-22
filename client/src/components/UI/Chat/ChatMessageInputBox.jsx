import { GoogleGenAI } from "@google/genai";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import { useContext, useState } from "react";
import { MessageContext } from "../../../context/MessageContext";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default function ChatMessageInputBox({ setChats, setIsLoading }) {
  const [query, setQuery] = useState();
  const { setMessageInfo } = useContext(MessageContext);

  //handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setQuery("");
    setChats((prev) => [
      ...prev,
      { sender: "YOU", incoming: false, message: query },
    ]);
    setIsLoading((prev) => !prev);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro-exp-03-25",
        contents: query,
      });
      setChats((prev) => [
        ...prev,
        { sender: "AI", incoming: true, message: response.text },
      ]);
    } catch (err) {
      console.log(err);
      setMessageInfo("Couldn't get reply! Please try again late.", true);
    }
    setIsLoading((prev) => !prev);
  };
  return (
    <form
      className="bg-white dark:bg-[var(--dark-bg-2)] rounded-full h-14 flex items-center w-full px-6 gap-6"
      onSubmit={(e) => handleFormSubmit(e)}
    >
      <label htmlFor="query" title="Write Query">
        <DescriptionIcon sx={{ fontSize: "1.3rem" }} />
      </label>
      <input
        type="text"
        value={query}
        className="focus:outline-none w-full text-sm"
        id="query"
        placeholder="Write your doubt here..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="cursor-pointer opacity-50 hover:opacity-100">
        <SendIcon sx={{ fontSize: "1.5rem" }} />
      </button>
    </form>
  );
}
