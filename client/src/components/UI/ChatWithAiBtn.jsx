import { useLocation, Link } from "react-router-dom";

export default function ChatWithAiBtn() {
  const location = useLocation();
  if (
    location.pathname === "/ai-mentor/chat" ||
    location.pathname.includes("/user/instructor")
  )
    return "";
  return (
    <button className="cursor-pointer fixed bottom-6 right-6 w-fit px-8 py-4 bg-[#f8611b] rounded-full opacity-90 hover:opacity-100">
      <Link to={"/ai-mentor/chat"} className="flex gap-2 font-semibold">
        Ask AI
        <img src="/images/chat.png" className="h-6" />
      </Link>
    </button>
  );
}
