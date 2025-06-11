import { useContext, useEffect, useState } from "react";
import { apiInstance } from "../../services/apis";
import AdminStudentCard from "../../components/UI/Admin/AdminStudentCard";
import { MessageContext } from "../../context/MessageContext";

export default function AdminAllStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuspended, setShowSuspended] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);

  const getStudents = async () => {
    return await apiInstance.get("/admin/students");
  };

  useEffect(() => {
    setIsLoading(true);
    getStudents()
      .then((res) => setStudents(res.data.students))
      .catch((err) => setMessageInfo(err.response.data.message))
      .finally(() => setIsLoading(false));
  }, []);

  console.log(students);

  return (
    <div className="flex flex-col px-6 h-[calc(100vh-6rem)] rounded-xl mx-auto w-full items-center">
      <h1 className="text-3xl font-semibold mb-2 w-[80%]">
        Total Students({students.length})
      </h1>
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
        {students?.map((student, idx) => {
          if (!showSuspended) {
            return (
              <AdminStudentCard
                idx={idx}
                key={idx}
                students={students}
                setStudents={setStudents}
              />
            );
          } else if (student.isSuspended) {
            return (
              <AdminStudentCard
                idx={idx}
                key={idx}
                students={students}
                setStudents={setStudents}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
