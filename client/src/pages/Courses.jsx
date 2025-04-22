import { useContext, useState } from "react";
import { CoursesContext } from "../context/CoursesContext";
import Loader from "../components/Loader";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { UserContext } from "../context/UserContext";
import CourseCard from "../components/UI/CourseCard";

export default function Courses() {
  const { courses } = useContext(CoursesContext);
  const { user } = useContext(UserContext);
  const [showEnrolled, setShowEnrolled] = useState(false);
  console.log(courses);
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      {!courses ? <Loader /> : ""}
      <>
        {/* filter  and search */}
        <div className="bg-[#188acc] flex px-4 md:px-8 h-16 justify-end gap-4 items-center text-white">
          <button
            className={
              "hidden md:block cursor-pointer hover:underline font-semibold" +
              (!showEnrolled && " underline")
            }
            onClick={() => setShowEnrolled(false)}
          >
            All Courses
          </button>
          {user && (
            <button
              className={
                "hidden md:block cursor-pointer hover:underline font-semibold" +
                (showEnrolled && " underline")
              }
              onClick={() => setShowEnrolled(!showEnrolled)}
            >
              Enrolled Courses
            </button>
          )}
          <select
            name=""
            id=""
            className="md:hidden font-semibold text-sm w-min cursor-pointer"
            onChange={(e) => {
              e.target.value == "enrolled"
                ? setShowEnrolled(true)
                : setShowEnrolled(false);
            }}
          >
            <option
              value="all"
              className="text-black"
              onSelect={() => setShowEnrolled(false)}
              selected={!showEnrolled}
            >
              All Courses
            </option>
            <option
              value="enrolled"
              className="text-black"
              onSelect={() => setShowEnrolled(!showEnrolled)}
              selected={showEnrolled}
            >
              Enrolled Courses
            </option>
          </select>

          <div className="max-w-[24rem] w-full md:w-[24rem] border-1 border-white px-4 py-2 rounded-full flex items-center gap-2 justify-between text-sm">
            <label htmlFor="search" className="cursor-pointer">
              <SearchIcon />
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search course..."
              className="border-none focus:outline-none w-full autofill:shadow-[inset_0_0_0px_1000px_#188acc] autofill:text-white"
              value={search}
              onChange={handleSearch}
            />
            <button
              className={"cursor-pointer" + (search.length ? "" : " hidden")}
              onClick={() => setSearch("")}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        {/* Courses  */}
        <main className="flex flex-wrap gap-8 my-8 w-full justify-center h-max m-auto px-4">
          {courses?.map((course, idx) => {
            return search ? (
              (course.content.join(" ") + " " + course.alias)
                .toLowerCase()
                .includes(search) ? (
                <CourseCard course={course} key={idx} />
              ) : (
                ""
              )
            ) : showEnrolled ? (
              user?.coursesEnrolled?.includes(course._id) ? (
                <CourseCard course={course} key={idx} />
              ) : (
                ""
              )
            ) : (
              <CourseCard course={course} key={idx} />
            );
          })}
        </main>
      </>
    </>
  );
}
