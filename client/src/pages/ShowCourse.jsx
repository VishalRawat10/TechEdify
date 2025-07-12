import { useState, useEffect, useContext } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";

import EnrollButton from "../components/UI/EnrollButton";
import Loader from "../components/Loader";
import ReviewCard from "../components/UI/ReviewCard";
import { apiInstance } from "../services/axios.config";
import { UserContext } from "../context/UserContext";
import StartLearningBtn from "../components/UI/StartLearningBtn";

export default function ShowCourse() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState();
  const [course, setCourse] = useState();
  const { user } = useContext(UserContext);
  const isEnrolled = user?.coursesEnrolled.includes(id);

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/courses/${id}`);
        setIsLoading(false);
        setCourse(res.data.course);
        console.log(res.data.course);
      } catch (err) {
        console.log(err);
        <Navigate to={"/courses"} />;
      }
    };
    getCourse();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <main
        className="px-4 xl:px-24 py-12 md:pt-16 "
        style={{ fontFamily: "Ubuntu, Poppins, sans-serif" }}
      >
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            {course?.name}
          </h1>
        </div>
        {/* Course Info */}
        <section className="w-full my-24 md:px-24">
          {/* Instructor info  */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="md:w-[50%] italic ">
              <span>{'"' + course?.instructor.messageToStudents + '"'}</span>
              <strong className="block mt-8 text-right">
                -
                <Link className="hover:underline">
                  {course?.instructor.name}
                </Link>
              </strong>
            </p>
            {/* instructor image  */}
            {course?.instructor.profileImg ? (
              <img
                src={course?.instructor.profileImg}
                className="w-[14rem] md:w-[17rem] rounded-full aspect-square object-cover"
                loading="lazy"
              />
            ) : (
              ""
            )}
          </div>
        </section>

        {/* Course profile image  */}
        <section className="mb-16">
          {course?.profileImg ? (
            <img
              src={course?.profileImg}
              className="rounded-2xl lg:w-[85%] max-h-[22rem] mx-auto"
              loading="lazy"
            />
          ) : (
            ""
          )}
        </section>
        <section className="flex flex-col md:flex-row gap-8 w-full ">
          {/* About course  */}
          <div className="border-[#188acc] rounded-xl border-1 p-8 md:p-12 w-full md:w-[60%] bg-white dark:bg-[var(--dark-bg-2)]">
            <h4 className="text-2xl font-semibold mb-4">About course</h4>
            <p>{course?.about}</p>
            <span className="flex justify-between items-center mt-4 flex-wrap gap-4">
              <p className="opacity-60 italic text-xl">
                @ &#8377;{course?.price} only
              </p>
              {isEnrolled ? (
                <StartLearningBtn courseId={id} />
              ) : (
                <EnrollButton courseId={id} setIsLoading={setIsLoading} />
              )}
            </span>
          </div>
          {/* Course Content  */}
          <div className="border-[#188acc] rounded-xl border-1 md:w-[40%] bg-white shadow-[3px_3px_1px_1px_var(--base-dim)] p-8 md:p-12 dark:bg-[var(--dark-bg-2)]">
            <h4 className="text-xl font-semibold mb-4">Chapters : </h4>
            <ol>
              {course?.chapters.map((chapter, idx) => (
                <li key={idx} className="mt-2 text-sm list-decimal ml-4">
                  {chapter.name}
                </li>
              ))}
            </ol>
          </div>
        </section>
        {/* Detailed course content  */}
        <div className="flex items-center flex-col mt-8 ">
          <div className="bg-white dark:bg-[var(--dark-bg-2)] rounded-xl p-8 md:p-12 w-full ">
            <p className="text-xl md:text-3xl font-semibold ">
              Detailed course content :
            </p>
            {course?.chapters.map((chapter, idx) => {
              return (
                <div key={idx} className="my-4">
                  <p className="font-semibold">{"->   " + chapter.name}</p>
                  <p className="opacity-80 pl-6">{chapter.content}</p>
                </div>
              );
            })}
          </div>
        </div>
        {isEnrolled ? (
          ""
        ) : (
          <div className="flex items-center my-6 md:my-24 w-full justify-between md:px-24 flex-wrap gap-4">
            <p className=" text-[#188acc] text-xl md:text-2xl">
              Enroll now <i>@ &#8377;{course?.price}</i> to start learning right
              now{" "}
            </p>
            <EnrollButton courseId={id} setIsLoading={setIsLoading} />
          </div>
        )}
        {/* Reviews on course  */}
        {course?.reviews.length ? (
          <div className="w-full mb-4 mt-4">
            <p className="text-xl font-semibold">Reviews: </p>
            <ul className="show-course-reviews-container max-w-full overflow-x-auto flex gap-4 pb-4">
              {course?.reviews.map((review, idx) => {
                return (
                  <li key={idx}>
                    <ReviewCard review={review} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}

        {/* Add reviews to course  */}
        {/* {
          <div className={isEnrolled ? "" : "hidden"}>
            <h3>Add your review : </h3>
            <form>
              <label htmlFor="rating">Rating</label>
              <Rating
                name="rating"
                size="large"
                id="rating"
                className="dark:bg-white"
              />
            </form>
          </div>
        } */}
      </main>
    </>
  );
}
