import { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import SearchIcon from "@mui/icons-material/Search";

import { UserContext } from "../../context/UserContext";
import CourseCard from "../../components/ui/CourseCard";
import { apiInstance } from "../../services/axios.config";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchedCourses, setSearchedCourses] = useState([]);
  const [showSearchedCourses, setShowSearchedCourses] = useState(false);
  const [currFilter, setCurrFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [search, setSearch] = useState(""); //search value

  const filters = ["All", "Development", "Language", "DSA"]; //filters
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getCourses = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get("/courses/published");
        setIsLoading(false);
        setCourses(res.data.courses);
      } catch (err) {
        setIsLoading(false);
        setMessageInfo(err.response.data.message, true);
      }
    };
    getCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  useEffect(() => {
    if (!search) {
      setShowSearchedCourses(false);
    }
  }, [search]);

  // filter courses
  if (user) {
    filters.splice(1, 0, "Enrolled");
  }
  const handleFilter = useCallback((e, filter) => {
    if (showSearchBox) {
      setShowSearchBox(false);
    }
    if (currFilter.toLowerCase() !== filter.toLowerCase()) {
      setCurrFilter(filter);
    }
    const filteredCourses = courses.filter((course) => {
      if (filter === "All") return true;
      if (filter === "Enrolled") {
        return user.enrolledCourses.includes(course._id);
      }
      return course.type === filter;
    });
    setFilteredCourses(filteredCourses);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!search) {
      if (showSearchedCourses) {
        setShowSearchedCourses(false);
      }
      return;
    }
    const matchedCourses = filteredCourses.filter((course) => {
      return (course.alias + " " + course.title)
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    setSearchedCourses(matchedCourses);
    setShowSearchedCourses(true);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main className="bg-light dark:bg-dark min-h-screen px-2 py-4 md:px-6 lg:px-12 flex flex-col gap-4 ">
        <h1 className="text-xl md:text-3xl">Our Courses</h1>
        <p className="text-sm md:text-4 ">
          You can start learning these courses and get skilled to get job ready.
        </p>
        {/* search and filter  */}
        <div className="flex justify-between items-center w-full gap-2 ">
          {/* fiter  */}
          <div
            className={
              "flex gap-2  scrollbar-none lg:overflow-x-auto " +
              (showSearchBox ? " overscroll-x-none" : " overflow-x-auto")
            }
          >
            {filters.map((filter, idx) => (
              <button
                key={idx}
                className={
                  "cursor-pointer flex items-center justify-center border-1 px-4 py-1 text-[12px] rounded-full lg:flex" +
                  (filter === currFilter
                    ? " border-green-600 bg-green-600 text-white"
                    : " hover:bg-green-600/30 dark:border-dark-primary border-light-primary") +
                  (showSearchBox && filter !== currFilter ? " hidden " : "")
                }
                style={{ transitionDuration: "0.2s" }}
                onClick={(e) => handleFilter(e, filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          {/* search  */}
          <form
            className={
              "py-2 px-4 rounded-full bg-light-card dark:bg-dark-subcard flex gap-2 items-center lg:w-[30rem] shadow-md" +
              (showSearchBox ? " w-full" : " w-fit")
            }
            onSubmit={handleSearch}
          >
            <SearchIcon
              sx={{ cursor: "pointer" }}
              className="hover:opacity-80"
              onClick={() => {
                setShowSearchBox(!showSearchBox);
              }}
            />
            <input
              type="search"
              placeholder="Search course..."
              className={
                "focus:outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary w-full lg:block text-sm" +
                (showSearchBox ? "" : " hidden")
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
        {/* courses  */}
        <div className="grid grid-cols-1 px-4 py-4 gap-y-8 gap-x-6 md:grid-cols-2  lg:grid-cols-3 lg:px-16">
          {showSearchedCourses ? (
            searchedCourses.length ? (
              searchedCourses.map((course, idx) => {
                const isEnrolled = user?.enrolledCourses?.includes(course._id);
                return (
                  <CourseCard
                    course={course}
                    key={idx}
                    isEnrolled={isEnrolled}
                  />
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center flex-col col-span-3 opacity-60">
                <img
                  src="/images/NoCourse.png"
                  alt=""
                  className="h-[10rem] aspect-auto"
                />
                <p className="text-2xl">No Course Found!</p>
              </div>
            )
          ) : filteredCourses.length ? (
            filteredCourses.map((course, idx) => {
              const isEnrolled = user?.enrolledCourses?.includes(course._id);
              return (
                <CourseCard course={course} key={idx} isEnrolled={isEnrolled} />
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center flex-col col-span-3 opacity-60">
              <img
                src="/images/NoCourse.png"
                alt=""
                className="h-[10rem] aspect-auto"
              />
              <p className="text-2xl">No Course Found!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
