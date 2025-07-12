import { Link, useNavigate, useParams } from "react-router-dom";
import { apiInstance } from "../../services/axios.config";
import { useContext, useState, useEffect } from "react";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function AdminShowStudentPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    apiInstance
      .get(`/admin/students/${studentId}`)
      .then((res) => setStudent(res.data.student))
      .catch((err) => {
        setMessageInfo(err.response.data.message, true);
        navigate("/admin/students");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const suspendStudent = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(`admin/students/${studentId}/suspend`);
      setStudent(res.data.student);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (req, res) => {
    setIsLoading(true);
    apiInstance
      .delete(`/admin/students/${studentId}`)
      .then((res) => {
        setMessageInfo("Student deleted successfully!", false);
        navigate("/admin/students");
      })
      .catch((err) => setMessageInfo(err.response.data.message, true))
      .finally(() => setIsLoading(false));
  };

  const unsuspendStudent = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/students/${studentId}/unsuspend`
      );
      setStudent(res.data.student);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const createdAt = new Date(student?.createdAt);
  console.log(student);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col items-center  gap-6 overflow-auto scrollbar-none">
      {" "}
      <div className="flex items-center justify-center flex-wrap gap-6 w-2/3 h-fit bg-white dark:bg-[var(--dark-bg-2)] shadow-lg dark:shadow-gray-900 p-6 rounded-2xl relative">
        <img
          src={student?.profileImg?.url || "/svg/Person.svg"}
          loading="lazy"
          alt=""
          className="h-38 rounded-full aspect-square object-cover border-2"
        />

        <div>
          <h2 className="text-3xl ">
            {student?.fullname?.firstname + " " + student?.fullname?.lastname}
          </h2>
          <p>
            <strong>Registered on: </strong>{" "}
            <i>
              {createdAt.toDateString() + ", " + createdAt.toLocaleTimeString()}
            </i>
          </p>
          <p>
            <strong>Email: </strong> <i>{student?.email}</i>
          </p>
          <p>
            <strong>id: </strong> <i>{student?._id}</i>
          </p>
        </div>
        <div className="w-full mx-12">
          <p>
            <strong>About: </strong>{" "}
            <i> {student?.about || "Not set by student."}</i>
          </p>
          <p>
            <strong>Address: </strong>{" "}
            <i> {student?.address || "Unavailable"}</i>
          </p>
          <p>
            <strong>DOB: </strong> <i> {student?.DOB || "Unavailable"}</i>
          </p>
          <p>
            <strong>Phone: </strong> <i> {student?.phone || "Unavailable"}</i>
          </p>
        </div>
        <div className="flex text-[13px] font-semibold absolute bottom-6 right-6 gap-6">
          {isLoading ? (
            <button
              className="cursor-pointer  disabled:cursor-not-allowed"
              disabled
            >
              Loading...
            </button>
          ) : student?.isSuspended ? (
            <button
              className="cursor-pointer  p-2 rounded-lg  border-1 hover:bg-green-500/30"
              onClick={(e) => unsuspendStudent()}
              style={{ transition: "background 0.1s linear" }}
            >
              Unsuspend
            </button>
          ) : (
            <button
              className="cursor-pointer  p-2 rounded-lg border-1 hover:bg-red-500/30"
              onClick={(e) => suspendStudent()}
              style={{ transition: "background 0.1s linear" }}
            >
              Suspend
            </button>
          )}
          <button
            className="cursor-pointer   p-2 rounded-lg border-1 hover:bg-red-500/30"
            style={{ transition: "background 0.1s linear" }}
            onClick={(e) => deleteStudent()}
          >
            Delete Student
          </button>
        </div>
      </div>
      {/* login details card */}
      <div className="rounded-2xl bg-white dark:bg-[var(--dark-bg-2)] w-2/3 p-8 shadow-lg">
        <p>User Logged In : {student?.isLoggedIn ? "Yes" : "No"}</p>
        <p>
          {student?.isLoggedIn
            ? "Logged in device : "
            : "Last logged in device : "}
          {student?.currDevice}
        </p>
        <p>
          {student?.isLoggedIn ? "Login time : " : "Last login time : "}
          {new Date(student?.currLoggedInTime).toDateString() +
            ", " +
            new Date(student?.currLoggedInTime).toLocaleTimeString()}
        </p>
      </div>
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-2">
          Enrolled Courses ({student?.coursesEnrolled?.length})
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {student?.coursesEnrolled?.length ? (
            student?.coursesEnrolled?.map((course, idx) => {
              return (
                <Link
                  to={`/admin/courses/${course._id}`}
                  className="hover:opacity-90 font-semibold text-sm"
                >
                  <img
                    src={course.profileImg}
                    alt=""
                    loading="lazy"
                    className="rounded-lg h-36 object-cover aspect-video"
                  />
                  <p>{course.name}</p>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-xl flex items-center justify-center">
              Student is not enrolled to any course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
