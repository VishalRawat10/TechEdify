import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function LecturePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);
  const [lectures, setLectures] = useState([]);
  const [course, setCourse] = useState();
  const [currLecture, setCurrLecture] = useState();
  const [readMore, setReadMore] = useState(false);
  const navigate = useNavigate();

  const getLectures = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.get(`/courses/${id}/lectures`);
      if (!res.data.lectures.length) {
        setMessageInfo("Course does not have any lecture!", true);
        navigate(`/courses/${id}`);
      }
      setLectures(res.data.lectures);
      setCurrLecture(res.data.lectures[0]);
      setCourse(res.data.course);
    } catch (err) {
      console.log(err);
      setMessageInfo(err.response.data.message, true);
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLectures();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main className="px-2 py-4 flex flex-col min-h-[calc(100vh-var(--header-h))] text-light-primary dark:text-dark-primary bg-light dark:bg-dark gap-4 sm:px-6 lg:grid lg:grid-cols-3 lg:min-h-fit lg:px-8 lg:gap-8">
        {/* Current Lecture */}
        <section className="flex flex-col gap-2 col-span-2">
          <h1 className=" text-2xl ">{course?.title}</h1>

          {/* lecture-video */}
          <div className="flex flex-col gap-2 text-light-primary dark:text-dark-primary">
            <h3 className="font-semibold text-xl">
              {lectures.indexOf(currLecture) + 1 + ". " + currLecture?.title}
            </h3>
            <video
              src={currLecture?.lectureVideo?.url}
              poster={currLecture?.thumbnail?.url}
              className="aspect-video object-contain w-full rounded-lg sm:rounded-xl"
              controlsList="nodownload"
              disablePictureInPicture
              controls
            ></video>
          </div>

          {/* lecture info  */}
          <div className="bg-light-card dark:bg-dark-card text-light-primary dark:text-dark-secondary text-justify p-2 flex flex-col gap-3 text-sm overflow-hidden rounded-lg sm:p-4">
            <p className="lg:hidden">
              {readMore
                ? currLecture?.description
                : currLecture?.description.slice(0, 100) + "..."}
            </p>
            <p className="hidden lg:block">{currLecture?.description}</p>
            {currLecture?.notes.url && (
              <p className={`${!readMore && "hidden"} lg:block`}>
                Notes :
                <a
                  href={currLecture?.notes.url}
                  className="hover:underline cursor-pointer text-light-accent dark:text-dark-accent"
                  target="_blank"
                >
                  Click to open!
                </a>
              </p>
            )}
            {currLecture?.assignment.url && (
              <p className={readMore ? "" : "hidden lg:block"}>
                Assignment :
                <a
                  href={currLecture?.assignment}
                  className="hover:underline cursor-pointer text-light-accent dark:text-dark-accent"
                >
                  Click to open!
                </a>
              </p>
            )}

            <DescriptionBtn readMore={readMore} setReadMore={setReadMore} />
          </div>
        </section>

        {/* All lectures */}
        <section className="flex flex-col gap-4 lg:pt-16">
          <h3 className="text-xl font-semibold">Lectures: </h3>
          <div className="flex flex-col max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 pb-2">
            {lectures.map((lecture, idx) => {
              return (
                <LectureCard
                  lecture={lecture}
                  key={uuidv4()}
                  idx={idx}
                  isCurrentLecture={lecture?._id === currLecture?._id}
                  setCurrLecture={setCurrLecture}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

const DescriptionBtn = ({ readMore, setReadMore }) => {
  return (
    <button
      className="w-fit cursor-pointer hover:underline font-normal flex items-center justify-center gap-1 lg:hidden"
      onClick={() => setReadMore(!readMore)}
    >
      {readMore ? "Read less" : "Read more"}
      {readMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </button>
  );
};

const LectureCard = ({ lecture, idx, isCurrentLecture, setCurrLecture }) => {
  const lectureCardClasses =
    "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.3)] dark:shadow-gray-400 py-4 px-2  flex gap-3 items-center cursor-pointer text-sm" +
    (isCurrentLecture
      ? " bg-gray-400/10 text-[#058c42]"
      : " hover:bg-gray-400/20");

  const handleLectureChange = (e) => {
    return setCurrLecture(lecture);
  };

  return (
    <>
      <button
        className={lectureCardClasses}
        title={lecture.title}
        onClick={handleLectureChange}
        disabled={isCurrentLecture}
      >
        <span className="border-2 min-h-6 max-fit aspect-square flex justify-center items-center rounded-full">
          {idx + 1}
        </span>

        <p className="text-left max-h-10 overflow-hidden">{lecture.title}</p>
        <KeyboardArrowRightIcon className="ml-auto" />
      </button>
    </>
  );
};
