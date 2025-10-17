import { memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
export const FormInput = memo(
  ({
    value,
    id,
    name,
    type,
    title,
    label,
    placeholder,
    required = false,
    errMsg,
    onChange,
    accept,
    disabled,
    accessKey,
    maxLength,
    min,
    max,
    className,
    children,
  }) => {
    return (
      <div
        className={`flex flex-col col-span-2 md:col-span-1 gap-1 ${className}`}
      >
        <label
          htmlFor={id || name}
          className={`capitalize ${errMsg && "text-red-600 dark:text-red-500"}`}
        >
          {label}
          {required && "*"}
        </label>
        <input
          className={
            "border-1 w-full focus:outline-none focus:ring-2 rounded-lg p-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-200" +
            (errMsg
              ? " border-red-600 focus:ring-red-600/30 dark:border-red-500 focus:dark:ring-red-400/30"
              : "border-gray-600 dark:border-gray-300 focus:border-black focus:dark:border-white focus:ring-main/50")
          }
          type={type || "text"}
          id={id || name}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          value={value}
          name={name}
          title={title || name}
          accept={accept}
          disabled={disabled}
          accessKey={accessKey}
          maxLength={maxLength}
          min={min}
          max={max}
        />
        {children}
        {errMsg && (
          <p className="text-[13px] text-red-600 dark:text-red-400">{errMsg}</p>
        )}
      </div>
    );
  }
);

export const FormButton = memo(
  ({ onClick, disabled, type, children, className }) => {
    return (
      <button
        type={type}
        className={`flex gap-2 text-sm items-center justify-center text-white dark:text-black bg-black dark:bg-white px-6 py-2 rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
);

export const FormTextarea = memo(
  ({
    value,
    id,
    name,
    title,
    label,
    placeholder,
    required = false,
    errMsg,
    onChange,
    disabled,
    accessKey,
    maxLength,
    cols,
    rows,
    className,
    children,
  }) => {
    return (
      <div
        className={`flex flex-col col-span-2 w-full md:col-span-1 gap-1 ${className}`}
      >
        <label
          htmlFor={id || name}
          className={`capitalize ${errMsg && "text-red-600 dark:text-red-500"}`}
        >
          {label}
          {required && "*"}
        </label>
        <textarea
          className={
            "border-1 w-full focus:outline-none focus:ring-2 rounded-lg p-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-200" +
            (errMsg
              ? " border-red-600 focus:ring-red-600/30 dark:border-red-500 focus:dark:ring-red-400/30"
              : "border-gray-600 dark:border-gray-300 focus:border-black focus:dark:border-white focus:ring-main/50")
          }
          id={id || name}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          value={value}
          name={name}
          title={title || name}
          disabled={disabled}
          accessKey={accessKey}
          maxLength={maxLength}
          cols={cols}
          rows={rows || 10}
        ></textarea>
        {children}
        {errMsg && (
          <p className="text-[13px] text-red-600 dark:text-red-400">{errMsg}</p>
        )}
      </div>
    );
  }
);

export const FormSelect = memo(
  ({
    name,
    id,
    className,
    onChange,
    defaultValue,
    errMsg,
    label,
    value,
    required,
    children,
  }) => {
    return (
      <div
        className={`flex flex-col col-span-2 md:col-span-1 gap-1 ${className}`}
      >
        <label
          htmlFor={id || name}
          className={`capitalize ${errMsg && "text-red-600 dark:text-red-500"}`}
        >
          {label}
          {required && "*"}
        </label>
        <select
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          className={
            "border-1 w-full focus:outline-none focus:ring-2 rounded-lg p-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-200 " +
            (errMsg
              ? " border-red-600 focus:ring-red-600/30 dark:border-red-500 focus:dark:ring-red-400/30"
              : "border-gray-600 dark:border-gray-300 focus:border-black focus:dark:border-white focus:ring-main/50")
          }
        >
          {children}
        </select>
        {errMsg && (
          <p className="text-[13px] text-red-600 dark:text-red-400">{errMsg}</p>
        )}
      </div>
    );
  }
);

export const FormOption = ({ value, disabled, className, children }) => {
  return (
    <option
      value={value}
      disabled={disabled}
      className={`bg-light-card dark:bg-dark-subcard rounded-xl ${className}`}
    >
      {children}
    </option>
  );
};

export const AuthInput = memo(
  ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = true,
    error,
    children,
  }) => {
    return (
      <div className="border-b-2 w-full px-2 py-2 relative flex bg-gray-200 dark:bg-gray-800">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          aria-label={label}
          aria-autocomplete="none"
          required={required}
          className="focus:outline-none w-full pr-10 placeholder:text-light-secondary placeholder:dark:text-dark-secondary text-light-primary dark:text-dark-primary"
        />
        {children}

        {error && (
          <div className="text-[11px] left-0 absolute top-full text-red-600 dark:text-red-400 ">
            {error}
          </div>
        )}
      </div>
    );
  }
);

export const AuthButton = memo(({ children }) => {
  return (
    <button className="bg-main hover:bg-main/85 px-3 py-2 cursor-pointer rounded-lg text-dark-primary">
      {children}
    </button>
  );
});

export const AddChapterBtn = ({
  setChapters,
  chapters,
  chapterErrors,
  disabled,
}) => {
  return (
    <button
      className="mt-2 py-2 bg-black/30 dark:bg-white/30 rounded-lg flex gap-2 justify-center items-center font-semibold cursor-pointer hover:opacity-80"
      onClick={(e) => {
        e.preventDefault();
        if (chapterErrors.isError) return;
        setChapters([...chapters, { name: "", content: "" }]);
      }}
      disabled={disabled}
    >
      <AddIcon />
      Add Chapter
    </button>
  );
};

export const SearchBox = ({
  name = "search",
  label,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div
      className={`flex gap-2 items-center rounded-lg border-1 w-full px-2 py-1 text-sm ${className}`}
    >
      <label htmlFor={name}>
        <SearchIcon fontSize="small" />
      </label>
      <input
        type="search"
        id={name}
        className="focus:outline-none w-full"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="S"
      />
    </div>
  );
};
