import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Edit from "@mui/icons-material/Edit";
import { UserContext } from "../../context/UserContext";
import { getDate } from "../../services/utils";
import Loader from "../../components/Loader";

export default function DashboardPage() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);
  return (
    <main className="flex flex-col gap-4 w-full px-4 py-4 mx-auto min-h-[calc(100vh-var(--header-h))] lg:w-4xl">
      {isLoading && <Loader />}
      {/* Profile Details */}
      <section className="w-full flex flex-col gap-4 items-center justify-center p-12 rounded-4xl text-center bg-light-card dark:bg-dark-card relative shadow-md">
        <div>
          <img
            src={user?.profileImage?.url || "/images/User.png"}
            alt=""
            loading="lazy"
            className="h-34 rounded-full aspect-square object-cover"
          />
        </div>
        <div>
          <h3 className="text-3xl">{user?.fullname}</h3>
          <p>{user?.email}</p>
          <p className="capitalize">
            <strong>Session : </strong>
            {getDate(user?.currLoginTime, true)} | {user?.currDevice}
          </p>
        </div>
        <Link
          className="flex items-center justify-center absolute top-4 right-4 bg-main/30 p-3 rounded-full hover:bg-main/40"
          to="/profile"
        >
          <Edit fontSize="small" />
        </Link>
      </section>

      {/* My Courses Section  */}
      <section className="w-full border-b-1 border-b-gray-500 dark:border-b-gray-600">
        <h3 className="text-2xl mb-2">
          My Courses({user?.enrolledCourses?.length})
        </h3>

        {/* My courses container  */}
        <div className="flex w-full gap-4 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 pb-6">
          {user.enrolledCourses.length ? (
            user.enrolledCourses.map((course, idx) => {
              return <MyCourseCard course={course} key={idx} />;
            })
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center w-full">
              <p className="text-2xl opacity-50 text-center">
                You have not puchased any course!
              </p>
              <Link
                className="p-2 px-4 rounded-lg bg-main text-white"
                to="/courses"
              >
                Explore courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* <section>
        <h3 className="text-2xl">Learning Analytics</h3>
      </section> */}
    </main>
  );
}

const MyCourseCard = ({ course }) => {
  return (
    <Link
      className="hover:opacity-85 flex flex-col gap-1 text-xs min-w-[13rem] sm:min-w-[17rem] sm:w-[17rem]"
      to={`/courses/${course._id}`}
    >
      <img
        src={course.thumbnail.url}
        title={course.title}
        loading="lazy"
        className="w-full rounded-xl aspect-video object-cover"
      />
      <p className="w-full">{course.title}</p>
    </Link>
  );
};
