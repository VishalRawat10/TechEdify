import { useContext, useState, useEffect } from "react";

import Loader from "../../components/Loader";
import { getMyCourses } from "../../services/utils";
import { MessageContext } from "../../context/MessageContext";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import MyCourseCard from "../../components/UI/Instructor/MyCourseCard";

export default function MyCourses() {
  const [isLoading, setIsLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const { setMessageInfo } = useContext(MessageContext);

  console.log(myCourses);
  useEffect(() => {
    getMyCourses(setMyCourses)
      .then((res) => setIsLoading(false))
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setMessageInfo("Unable to fetch courses!", true);
      });
  }, []);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="overflow-y-auto scrollbar-none px-10 h-[calc(100vh-5rem)] scroll-smooth">
      <h2 className="text-3xl uppercase font-semibold mb-2">My Courses</h2>
      {myCourses.length ? (
        // Show all courses

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6">
          {myCourses.map((course, idx) => (
            <MyCourseCard course={course} key={idx} />
          ))}
        </div>
      ) : (
        // Empty courses
        <div className=" w-full mx-auto flex flex-col justify-center items-center h-[calc(100vh-6rem)] gap-4 ">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--base)] opacity-60 text-center">
            NO COURSE CREATED BY YOU
          </h3>

          <Link
            to="/instructor/my-courses/new"
            className="flex items-center justify-center gap-2 font-semibold px-4 py-2 bg-amber-600 rounded-lg text-white hover:scale-101"
          >
            <AddIcon fontSize="medium" />
            Create your first course
          </Link>
        </div>
      )}
    </div>
  );
}
