import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "6pp";

import { apiInstance } from "../../services/apis";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function Lectures() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);
  const [course, setCourse] = useState();
  const [currLecNo, setCurrLecNo] = useState(0);
  const [showDescription, setShowDesciption] = useState(false);
  const navigate = useNavigate();

  const getLectures = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.get(`/courses/${id}/lectures`);
      console.log(res.data.course);
      setCourse(res.data.course);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setMessageInfo(err.response.data.message, true);
      setIsLoading(false);
      navigate(-1);
    }
  };
  useEffect(() => {
    getLectures();
  }, []);

  //handleLectureBtnClick
  const handleLectureBtnClick = (e, idx) => {
    setCurrLecNo(idx);
  };
  return isLoading ? (
    <Loader />
  ) : (
    <main className="p-2 lg:p-8 grid grid-cols-3 gap-2">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold col-span-3">
        {course?.name}
      </h1>
      {/* lecture video section */}
      <section className="col-span-3 md:col-span-2 flex flex-col gap-2 relative">
        <video
          src={course?.lectures[currLecNo]?.lectureVideo.url}
          className="aspect-video object-cover rounded-xl"
          poster={course?.lectures[currLecNo]?.thumbnail}
          controls
        ></video>
        <button
          className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-xl cursor-pointer md:cursor-auto text-left "
          onClick={() => setShowDesciption(!showDescription)}
        >
          <h2 className=" text-lg font-semibold">
            {currLecNo + 1 + ".  " + course?.lectures[currLecNo]?.title}
          </h2>
          <p
            className={
              "md:block text-sm opacity-80" +
              " " +
              (showDescription ? "" : "hidden")
            }
          >
            {course?.lectures[currLecNo]?.description}
          </p>
        </button>
      </section>
      {/* lectures section */}
      <section className="all-lectures bg-white dark:bg-[var(--dark-bg-2)] rounded-xl lg:ml-8 h-[50vh] sm:h-[70vh] lg:h-screen overflow-y-auto scrollbar-thin dark:scrollbar-thumb-white/30 scrollbar-thumb-black/30 scrollbar-track-transparent col-span-3 md:col-span-1">
        <h3 className="text-lg opacity-85 ml-4 my-4 font-semibold">
          Lectures:
        </h3>
        <div className="flex flex-col">
          {course?.lectures.map((lecture, idx) => {
            return (
              <button
                key={idx}
                className={
                  "grid grid-cols-3 p-2 md:p-4 cursor-pointer hover:bg-black/20 hover:dark:bg-white/20 mr-2" +
                  " " +
                  (currLecNo === idx ? "bg-black/30 dark:bg-white/30 " : "")
                }
                onClick={(e) => handleLectureBtnClick(e, idx)}
              >
                <img
                  src={lecture.thumbnail}
                  alt=""
                  className="col-span-1 aspect-video object-cover h-12"
                />
                <p className="col-span-2 text-left text-[12px] opacity-80">
                  {idx + 1}.&nbsp; {lecture.title}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
