import { useContext, useState } from "react";
import { MessageContext } from "../../../context/MessageContext";
import { apiInstance } from "../../../services/apis";

export default function AdminInstructorCard({
  instructors,
  setInstructors,
  idx,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { setMessageInfo } = useContext(MessageContext);

  const suspendInstructor = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/instructors/${instructors[idx]._id}/suspend`
      );
      const updatedInstructors = [...instructors];
      updatedInstructors[idx] = res.data.instructor;
      setInstructors(updatedInstructors);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const unsuspendInstructor = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/instructors/${instructors[idx]._id}/unsuspend`
      );
      const updatedInstructors = [...instructors];
      updatedInstructors[idx] = res.data.instructor;
      setInstructors(updatedInstructors);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  //   const createAtDate = instructors[idx].createdAt.toLocaleString();
  //   const createAtTime = students[idx].createAt.toLocaleTimeString();
  return (
    <div
      className="flex px-3 py-3 bg-white dark:bg-[var(--dark-bg-2)] justify-between rounded-lg shadow-md dark:shadow-gray-800 hover:scale-102 cursor-pointer w-[80%]"
      style={{ transition: "scale 0.2s linear" }}
    >
      <div className="flex gap-2 items-center">
        <img
          src={instructors[idx]?.profileImg || "/svg/Person.svg"}
          className="h-16 object-cover aspect-square rounded-full "
          alt=""
          loading="lazy"
        />
        <span className="grid text-gray-700 dark:text-gray-300">
          <p className="font-semibold">{instructors[idx]?.name}</p>

          <i className="text-[12px]">created at :lksjfsljf</i>
        </span>
      </div>
      {isLoading ? (
        <button
          className="cursor-pointer text-sm  font-semibold disabled:cursor-not-allowed"
          disabled
        >
          Loading...
        </button>
      ) : instructors[idx].isSuspended ? (
        <button
          className="cursor-pointer text-sm hover:underline font-semibold text-red-500"
          onClick={(e) => unsuspendInstructor()}
        >
          Unsuspend
        </button>
      ) : (
        <button
          className="cursor-pointer text-sm hover:underline font-semibold text-green-500"
          onClick={(e) => suspendInstructor()}
        >
          Suspend
        </button>
      )}
    </div>
  );
}
