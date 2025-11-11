export default function NewMessage({ message, onMarkAsRead, onClose }) {
  if (!message) return;
  return (
    <div className="absolute z-40 w-full flex justify-center top-8 px-4">
      <div className="flex items-center text-sm bg-[#51927F] p-2 pb-4 rounded-lg gap-2 relative w-full md:w-[70%] lg:w-[50%]">
        <img
          src={
            message?.course?.thumbnail?.url ||
            message?.sender?.profileImage?.url ||
            "/images/User.png"
          }
          alt="Image"
          className="h-12 aspect-square rounded-full"
        />
        <div>
          <p className="font-semibold text-[11px] text-[#8BC34A] text-ellipsis line-clamp-1">
            {message?.sender?.fullname}
          </p>
          <p className="text-ellipsis line-clamp-2 text-white">
            {message?.content}
          </p>
          {/* CTA Buttons  */}
          <div className="text-xs flex gap-2 justify-end text-[#FFFF00]">
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
        </div>

        <div className="absolute top-[1px] h-full animate-chat-message left-0 rounded-lg"></div>
      </div>
    </div>
  );
}
