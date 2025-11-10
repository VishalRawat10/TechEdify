import { useState, useEffect, useContext } from "react";
import { apiInstance } from "../../../../services/axios.config";
import AdminFilterBar from "../shared/AdminFilterBar";
import TutorCard from "../shared/TutorCard";
import CreateTutorForm from "../shared/CreateTutorForm";
import { Add } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { MessageContext } from "../../../../context/MessageContext";

export default function TutorsSection({ setIsLoading }) {
  const [tutors, setTutors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);

  // Fetch all tutors
  const fetchTutors = async () => {
    try {
      const res = await apiInstance.get("/admin/tutors");
      setTutors(res.data.tutors || []);
    } catch (err) {
      console.error("Error fetching tutors:", err);
      setMessageInfo(err.response.data.message || "Failed to load tutors!");
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // Handle tutor card actions (delete/suspend)
  const handleAction = (type, id) => {
    if (type === "delete") {
      setTutors((prev) => prev.filter((t) => t._id !== id));
    } else if (type === "toggleSuspend") {
      setTutors((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, isSuspended: !t.isSuspended } : t
        )
      );
    }
  };

  // Handle adding a new tutor from modal
  const handleTutorCreated = (newTutor) => {
    setTutors((prev) => [newTutor, ...prev]);
  };

  // Apply filter + search
  const filteredTutors = tutors.filter((t) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "suspended"
        ? t.isSuspended
        : !t.isSuspended;
    const matchesSearch = t.fullname
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section
      id="tutors"
      className="min-h-[100vh] py-6 border-b border-gray-300 dark:border-gray-600"
    >
      {/* Header with button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className="text-2xl font-bold mb-3 sm:mb-0">All Tutors</h3>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="bg-main text-white hover:bg-main/80 transition rounded-lg px-2 py-1 cursor-pointer"
        >
          <Add className="text-black dark:text-white" />
          <span className="ml-1 font-medium text-sm hidden sm:inline">
            Create New Tutor
          </span>
        </button>
      </div>

      {/* Filters and Search */}
      <AdminFilterBar
        filters={[
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Suspended", value: "suspended" },
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchQuery={search}
        onSearchChange={setSearch}
        placeholder="Search tutors..."
      />

      {/* Tutors Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {filteredTutors.length ? (
          filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor._id}
              tutor={tutor}
              onAction={handleAction}
              setIsLoading={setIsLoading}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No tutors found.
          </p>
        )}
      </div>

      {/* Create New Tutor Modal */}
      <CreateTutorForm
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onTutorCreated={handleTutorCreated}
        setIsLoading={setIsLoading}
      />
    </section>
  );
}
