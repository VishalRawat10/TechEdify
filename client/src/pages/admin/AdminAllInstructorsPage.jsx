import { useEffect, useState, useContext } from "react";
import { apiInstance } from "../../services/axios.config";
import AdminInstructorCard from "../../components/UI/Admin/AdminInstructorCard";
import { MessageContext } from "../../context/MessageContext";
import { Link } from "react-router-dom";

export default function AdminAllInstructorPage() {
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuspended, setShowSuspended] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);

  const getInstructors = async () => {
    return await apiInstance.get("/admin/instructors");
  };

  useEffect(() => {
    setIsLoading(true);
    getInstructors()
      .then((res) => setInstructors(res.data.instructors))
      .catch((err) => setMessageInfo(err.response.data.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col px-6 h-[calc(100vh-6rem)] rounded-xl mx-auto w-full items-center mt-4">
      <div className="w-[80%] mb-2 flex justify-between items-center">
        <h1 className="text-3xl font-semibold ">
          Total instructors({instructors.length})
        </h1>
        <Link
          to={"/admin/instructors/new"}
          className="px-4 py-2 rounded-lg bg-green-600 text-[13px] font-semibold opacity-80 hover:opacity-100"
          style={{ transition: "opacity 0.2s linear" }}
        >
          Create instructor
        </Link>
      </div>
      <div className="mb-6 text-[13px] flex gap-2 w-[80%]">
        <button
          className={
            "rounded-full border-1 border-green-500 px-3 py-1 cursor-pointer hover:bg-green-500/20" +
            " " +
            (!showSuspended ? "bg-green-500/20" : "")
          }
          onClick={() => setShowSuspended(false)}
        >
          All
        </button>
        <button
          className={
            "rounded-full border-1 border-green-500 px-3 py-1 cursor-pointer hover:bg-green-500/20" +
            " " +
            (showSuspended ? "bg-green-500/20" : "")
          }
          onClick={() => setShowSuspended(true)}
        >
          Suspended
        </button>
      </div>
      <div className="w-full flex flex-col items-center gap-1 h-[calc(100vh-6rem)] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {instructors?.map((instructor, idx) => {
          if (!showSuspended) {
            return (
              <AdminInstructorCard
                idx={idx}
                key={idx}
                instructors={instructors}
                setInstructors={setInstructors}
              />
            );
          } else if (instructor.isSuspended) {
            return (
              <AdminInstructorCard
                idx={idx}
                key={idx}
                instructors={instructors}
                setInstructors={setInstructors}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
