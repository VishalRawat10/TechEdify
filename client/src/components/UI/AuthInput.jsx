export default function AuthInput({
  label,
  name,
  type,
  placeholder,
  value,
  handleOnChange,
  required = true,
}) {
  return (
    <div className="border-b-2 w-full px-4 py-2">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleOnChange}
        aria-label={label}
        aria-autocomplete="none"
        required={required}
        className="focus:outline-none w-full"
      />
    </div>
  );
}
