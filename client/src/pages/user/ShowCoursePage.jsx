import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EnrollButton from "../../components/UI/EnrollButton";
import Loader from "../../components/Loader";
import { apiInstance } from "../../services/axios.config";
import { UserContext } from "../../context/UserContext";
import StartLearningBtn from "../../components/UI/StartLearningBtn";
import { MessageContext } from "../../context/MessageContext";

export default function ShowCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setMessageInfo } = useContext(MessageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState();
  const { user } = useContext(UserContext);
  const isEnrolled = user?.enrolledCourses.some((course) => course._id === id);

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/courses/${id}`);
        setIsLoading(false);
        setCourse(res.data.course);
      } catch (err) {
        setMessageInfo(err.response.data.message, true);
        navigate("/courses");
      }
    };
    getCourse();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main className="px-4 xl:px-24 py-12 md:pt-16 ">
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            {course?.title}
          </h1>
        </div>

        {/* Tutor info  */}
        <section className="w-full my-24 md:px-24">
          <div className="flex gap-1 items-end ml-auto w-fit ">
            <p className="border-main border-1 rounded-4xl rounded-br-none p-10 lg:max-w-[30rem]">
              {'"' + course?.tutor?.message + '"'}
            </p>
            {/* tutor image  */}
            <div className="min-w-fit">
              <img
                src={course?.tutor.profileImage?.url || "/images/User.png"}
                className="h-13 rounded-full aspect-square object-cover mx-auto"
                loading="lazy"
                alt={course?.tutor.fullname}
              />
              <p className="text-[12px]">{course?.tutor?.fullname}</p>
            </div>
          </div>
        </section>

        {/* Course Thumbnail  */}
        <section className="mb-16">
          {course?.thumbnail && (
            <img
              src={course?.thumbnail?.url}
              className="rounded-2xl lg:w-[85%] max-h-[22rem] mx-auto"
              loading="lazy"
              alt={course?.thumbnail.filename}
            />
          )}
        </section>

        {/* Course Info */}
        <section className="flex flex-col  gap-8 w-full md:flex-row">
          {/* About course  */}
          <div className="border-main rounded-4xl border-1 p-8 lg:p-12 w-full lg:w-fit">
            <h4 className="text-2xl mb-4">About course</h4>
            <p className="text-sm text-justify">{course?.description}</p>
            <span className="flex justify-between items-center mt-4 flex-wrap gap-4">
              {!isEnrolled && (
                <p className="opacity-60 italic text-xl">
                  @ &#8377;{course?.price} only
                </p>
              )}
              {isEnrolled ? (
                <StartLearningBtn courseId={id} />
              ) : (
                <EnrollButton courseId={id} setIsLoading={setIsLoading} />
              )}
            </span>
          </div>

          {/* Course Chapters  */}
          <div className="flex flex-col border-main rounded-4xl border-1 w-full p-8 lg:w-[40rem] lg:justify-center">
            <h4 className="text-xl font-semibold mb-4">Chapters : </h4>
            <ol className="pl-4">
              {course?.chapters?.map((chapter, idx) => (
                <li key={idx} className="mt-2 text-sm list-decimal ml-4">
                  {chapter.name}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Detailed course content  */}
        <section className="flex items-center flex-col mt-8 ">
          <div className="bg-white dark:bg-dark-subcard rounded-xl shadow-md p-8 lg:p-12 w-full ">
            <p className="text-xl lg:text-3xl ">Detailed course content :</p>
            {course?.chapters.map((chapter, idx) => {
              return (
                <div key={idx} className="my-4 px-4">
                  <p className="font-semibold">{"->   " + chapter.name}</p>
                  <p className="opacity-80 px-5">{chapter.content}</p>
                </div>
              );
            })}
          </div>
        </section>

        {!isEnrolled && (
          <div className="flex items-center my-6 md:my-24 w-full justify-between md:px-24 flex-wrap gap-4">
            <p className=" text-[#188acc] text-xl md:text-2xl">
              Enroll now <i>@ &#8377;{course?.price}</i> to start learning right
              now{" "}
            </p>
            <EnrollButton courseId={id} setIsLoading={setIsLoading} />
          </div>
        )}
      </main>
    </>
  );
}
