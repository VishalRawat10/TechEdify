export default function ChatMessage({ sender, message, incoming, isLoading }) {
  return (
    <div
      className={
        "w-full flex gap-x-2 justify-baseline " +
        " " +
        (incoming ? "flex-row-reverse" : "")
      }
    >
      <h4 className="text-[12px]  font-semibold text-[#188acc]">{sender}</h4>{" "}
      <span className=" max-w-[90%] md:max-w-2/3 bg-white dark:bg-[var(--dark-bg-2)] px-4 py-2 rounded-xl text-sm">
        {message}
      </span>
    </div>
  );
}
