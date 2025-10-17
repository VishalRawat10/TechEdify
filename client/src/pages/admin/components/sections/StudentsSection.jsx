import { useState, useEffect, useContext } from "react";
import AdminFilterBar from "../shared/AdminFilterBar";
import StudentCard from "../shared/StudentCard";
import { apiInstance } from "../../../../services/axios.config";
import { MessageContext } from "../../../../context/MessageContext";

export default function StudentsSection({ setIsLoading }) {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { setMessageInfo } = useContext(MessageContext);

  const fetchStudents = async () => {
    try {
      const res = await apiInstance.get("/admin/students");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setMessageInfo(err.response.data.message || "Unable to load students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAction = (type, id) => {
    if (type === "delete") {
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } else if (type === "toggleSuspend") {
      setStudents((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isSuspended: !s.isSuspended } : s
        )
      );
    }
  };

  const filtered = students.filter((s) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "suspended"
        ? s.isSuspended
        : !s.isSuspended;
    const matchesSearch = s.fullname
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section
      id="students"
      className="min-h-[100vh] py-6 border-b border-gray-300 dark:border-gray-600"
    >
      <h3 className="text-2xl font-bold mb-6">All Students</h3>

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
        placeholder="Search students..."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length ? (
          filtered.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onAction={handleAction}
              setIsLoading={setIsLoading}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No students found.
          </p>
        )}
      </div>
    </section>
  );
}
