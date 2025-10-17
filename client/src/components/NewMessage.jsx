export default function NewMessage({ message, onMarkAsRead, onClose }) {
  if (!message) return;
  return (
    <div className="absolute z-40 w-full flex justify-center top-8 px-4">
      <div className=" text-sm bg-main p-2 pb-4 rounded-lg gap-2 relative w-full lg:w-[40%]">
        <div className="flex gap-3">
          <img
            src={
              message?.course?.thumbnail?.url ||
              message?.sender?.profileImage?.url ||
              "/images/User.png"
            }
            alt="Image"
            className="h-8 aspect-square rounded-full"
          />
          <div>
            <p className="font-semibold text-[11px] text-red-500 text-ellipsis">
              {message?.sender?.fullname}
            </p>
            <p>{message?.content} </p>
          </div>
        </div>
        <div className="absolute right-2 bottom-2 flex gap-4 text-xs uppercase">
          <button
            className="cursor-pointer px-2 py-1 hover:bg-white/10 rounded-md uppercase"
            onClick={(e) => onMarkAsRead()}
          >
            Mark as read
          </button>
          <button
            className="cursor-pointer px-2 py-1 hover:bg-white/10 rounded-md uppercase"
            onClick={(e) => onClose()}
          >
            Remove
          </button>
        </div>
        <div className="absolute top-[1px] h-full animate-chat-message left-0 rounded-lg"></div>
      </div>
    </div>
  );
}
