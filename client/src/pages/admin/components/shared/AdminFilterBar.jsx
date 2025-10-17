import SearchIcon from "@mui/icons-material/Search";

export default function AdminFilterBar({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  placeholder,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 text-sm">
      <div className="flex gap-2">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`capitalize cursor-pointer px-3 py-1 rounded-full border transition-colors duration-200 ${
              activeFilter === value
                ? "bg-main text-white border-main"
                : "border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-1/3 rounded-lg border border-gray-400 dark:border-gray-600 bg-transparent flex gap-2 items-center px-2">
        <label htmlFor="search" className="cursor-pointer">
          <SearchIcon fontSize="small" />
        </label>

        <input
          id="search"
          type="search"
          placeholder={placeholder || "Search..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-2 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}
