import { useContext, useState } from "react";
import { MessageContext } from "../../../context/MessageContext";
import { apiInstance } from "../../../services/apis";
import { Link } from "react-router-dom";

export default function AdminStudentCard({ students, setStudents, idx }) {
  const [isLoading, setIsLoading] = useState(false);

  const { setMessageInfo } = useContext(MessageContext);

  const suspendStudent = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/students/${students[idx]._id}/suspend`
      );
      const updatedStudents = [...students];
      updatedStudents[idx] = res.data.student;
      setStudents(updatedStudents);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const unsuspendStudent = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/students/${students[idx]._id}/unsuspend`
      );
      const updatedStudents = [...students];
      updatedStudents[idx] = res.data.student;
      setStudents(updatedStudents);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const createAtDate = new Date(students[idx].createdAt);
  return (
    <Link
      to={`/admin/students/${students[idx]._id}`}
      className="flex px-3 py-3 bg-white dark:bg-[var(--dark-bg-2)] justify-between rounded-lg shadow-md dark:shadow-gray-800 hover:scale-102 cursor-pointer w-[80%]"
      style={{ transition: "scale 0.2s linear" }}
    >
      <div className="flex gap-2 items-center">
        <img
          src={students[idx]?.profileImg?.url || "/svg/Person.svg"}
          className="h-16 object-cover aspect-square rounded-full "
          loading="lazy"
          alt=""
        />
        <span className="grid text-gray-700 dark:text-gray-300">
          <p className="font-semibold">
            {students[idx]?.fullname.firstname +
              " " +
              students[idx]?.fullname.lastname}
          </p>
          <i className="text-[12px]">{students[idx]?.email}</i>
          <i className="text-[12px]">
            Registered on :{" "}
            {createAtDate.toDateString() +
              ", " +
              createAtDate.toLocaleTimeString()}
          </i>

          <i className="text-[12px]">
            Courses enrolled: {students[idx]?.coursesEnrolled?.length}
          </i>
        </span>
      </div>
      <div className="flex gap-2 items-center text-sm font-semibold">
        {/* {isLoading ? (
          <button
            className="cursor-pointer  disabled:cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        ) : students[idx].isSuspended ? (
          <button
            className="cursor-pointer text-sm hover:underline font-semibold text-red-500"
            onClick={(e) => unsuspendStudent()}
          >
            Unsuspend
          </button>
        ) : (
          <button
            className="cursor-pointer text-sm hover:underline font-semibold text-green-500"
            onClick={(e) => suspendStudent()}
          >
            Suspend
          </button>
        )} */}
      </div>
    </Link>
  );
}
