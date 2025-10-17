import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { getTime } from "../services/utils";

export function ChatInput({
  className,
  placeholder,
  maxLength,
  minLength,
  onChange,
  value,
  name,
  type,
  disabled,
  children,
}) {
  return (
    <div
      className={`flex gap-2 justify-between items-center bg-white dark:bg-dark-subcard w-full rounded-full text-sm p-3 px-6 shadow-md  ${className}`}
    >
      <input
        type={type || "text"}
        placeholder={placeholder}
        name={name}
        value={value}
        className={`focus:outline-none w-full placeholder:text-gray-600 dark:placeholder:text-gray-400`}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        onChange={onChange}
      />
      <button
        className="flex items-center justify-center cursor-pointer hover:opacity-80"
        disabled={!value || disabled}
      >
        <SendIcon />
      </button>

      {children}
    </div>
  );
}

export function Message({
  message,
  senderName,
  isMe = true,
  date,
  isRead = false,
  isContinuous,
  senderImage,
  handleDeleteMessage,
}) {
  return (
    <div className={`flex gap-2 w-full ${isMe && "flex-row-reverse"}`}>
      <img
        src={senderImage || "/images/User.png"}
        alt=""
        className={`h-8 aspect-square rounded-full object-cover ${
          isContinuous && "invisible"
        }`}
      />

      {/* Message container  */}
      <div className="group relative cursor-pointer max-w-[90%] lg:max-w-2/3">
        {/* Delete chat btn  */}
        <button
          className={`opacity-0 group-hover:opacity-80 cursor-pointer hover:opacity-100 absolute top-1 -left-4 ${
            !isMe && "hidden"
          }`}
          disabled={!isMe}
          onClick={handleDeleteMessage}
        >
          <DeleteIcon fontSize="16px" />
        </button>

        {/* message  */}
        <div
          className={`bg-light-card dark:bg-dark-card p-2 text-sm rounded-lg ${
            isMe
              ? !isContinuous && "mt-2 rounded-tr-none "
              : !isContinuous && "mt-2 rounded-tl-none "
          } ${isMe && "bg-main dark:bg-main text-white"}`}
        >
          <p>{message}</p>
          <p className="text-[8px] text-right">{getTime(date)}</p>
        </div>
      </div>
    </div>
  );
}

export const SearchBox = ({
  placeholder,
  label,
  onChange,
  minLength,
  maxLength,
  required,
  name,
  value,
  disabled,
  className,
  children,
}) => {
  return (
    <div
      className={`w-full flex border-1 rounded-full items-center p-2 px-4 gap-2 text-sm ${className}`}
    >
      <label htmlFor="search">
        <SearchIcon fontSize="small" />
      </label>
      <input
        id="search"
        type="search"
        className=" w-full focus:outline-none"
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export const ResultCard = ({
  person,
  course,
  onClickMessage,
  onClickCreate,
}) => {
  return (
    <div className="flex justify-between text-xs py-2 border-b-1 border-b-gray-300 dark:border-b-gray-700">
      <div className="flex items-center justify-center gap-2">
        <img
          src={
            course?.thumbnail.url ||
            person?.profileImage?.url ||
            "/images/User.png"
          }
          loading="lazy"
          className="h-8 rounded-full aspect-square object-cover"
        />
        {course?.title || person?.fullname}
      </div>
      <button
        className="text-green-600 dark:text-green-500 cursor-pointer hover:underline"
        onClick={(e) => {
          if (course) return onClickCreate(course);
          return onClickMessage(person);
        }}
      >
        {course ? "Create" : "Message"}
      </button>
    </div>
  );
};
