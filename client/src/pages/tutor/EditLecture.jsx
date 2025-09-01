import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { TutorContext } from "../../context/TutorContext";
import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import {
  FormInput,
  FormButton,
  FormTextarea,
} from "../../components/FormComponents";

export default function EditLecturePage() {
  const { setIsLoading, isLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const { lectureId, courseId } = useParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [currLecture, setCurrLecture] = useState();
  const [showLectures, setShowLectures] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const res = await apiInstance.get(
          `/tutors/courses/${courseId}/lectures`
        );
        setLectures(res.data.lectures);

        let lecture;
        res.data.lectures.map((lec) => {
          if (lec._id === lectureId) lecture = lec;
        });
        if (!lecture) {
          throw Error("Lecture not found!");
        }
        setCurrLecture(lecture);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setMessageInfo(
          err.response.data.message || err.message || "Internal server error!"
        );
        navigate("/tutor/courses");
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    setCurrLecture({ ...currLecture, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(currLecture).forEach((key) => {
      if (key === "thumbnail" && !currLecture[key]) {
        return;
      }
      if (key === "lectureVideo" && !currLecture[key]) {
        return;
      }
      if (key === "notes" && !currLecture[key]) {
        return;
      }
      if (key === "assignment" && !currLecture[key]) {
        return;
      }
      formData.append(key, currLecture[key]);
    });
    setIsUploading(true);
    try {
      const res = await apiInstance.put(
        `/courses/${courseId}/lectures/${lectureId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCurrLecture(res.data.lecture);
      setLectures((prev) => {
        return prev.map((lecture) => {
          if (lecture._id === res.data.lecture._id) {
            return res.data.lecture;
          }
          return lecture;
        });
      });
      setIsUploading(false);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
      setMessageInfo(err.response.data.message || "Unable to update lecture!");
    }
  };

  const discardChanges = (e) => {
    e.preventDefault();
    setCurrLecture(() => {
      let lec;
      lectures.map((lecture, idx) => {
        if (lecture._id === lectureId) {
          lec = lecture;
        }
      });
      return lec;
    });
  };

  return (
    <div className="flex flex-col py-4 px-4 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 gap-4 sm:px-10 lg:flex-row lg:px-2 lg:overflow-hidden lg:gap-0">
      {/* Edit course form  */}
      <div className="rounded-xl w-full mx-auto lg:px-6 xl:w-[60rem] ">
        <h1 className="text-xl flex gap-2 items-center text-main font-semibold sm:text-2xl">
          {currLecture?.course?.title}
        </h1>

        {/* Uploading animation  */}
        {isUploading && (
          <div className="w-full bg-green-500 dark:bg-green-600 rounded-lg p-4 flex gap-4 items-center text-sm text-white">
            <CircularProgress size={"20px"} color="white" /> Lecture is
            uploading! Do not exit or logout!
          </div>
        )}
        <form
          className="flex flex-col gap-6 h-fit overflow-y-auto scrollbar-none px-2 text-sm py-3 lg:h-[calc(100vh-11rem)]"
          onSubmit={handleFormSubmit}
        >
          <FormInput
            label="Lecture Title"
            name="title"
            value={currLecture?.title}
            placeholder="Enter the course title"
            required={true}
            onChange={handleInputChange}
            disabled={isUploading}
          />
          <FormTextarea
            label="Lecture description"
            name="description"
            value={currLecture?.description}
            placeholder="Enter the course title"
            required={true}
            onChange={handleInputChange}
            disabled={isUploading}
          ></FormTextarea>

          {/* Lecture Thumbnail  */}
          <div className="flex flex-col gap-1">
            <div>
              <p>Lecture Thumbnail</p>
              <img
                src={currLecture?.thumbnail?.url}
                loading="lazy"
                className="w-full rounded-xl"
              />
            </div>
            <FormInput
              label="New thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCurrLecture({
                  ...currLecture,
                  thumbnail: e.target.files[0],
                })
              }
              disabled={isUploading}
            />
          </div>
          {/* Lecture Video  */}
          <div className="flex flex-col gap-1">
            <div>
              <p>Lecture Video</p>
              <video
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full rounded-xl aspect-video object-cover"
                poster={currLecture?.thumbnail?.url}
                controls
              ></video>
            </div>
            <FormInput
              label="New Lecture Video"
              name="lectureVideo"
              type="file"
              accept="video/*"
              onChange={(e) =>
                setCurrLecture({
                  ...currLecture,
                  lectureVideo: e.target.files[0],
                })
              }
              disabled={isUploading}
            />
          </div>

          {/* Lecture notes  */}
          <div className="flex flex-col gap-1">
            {currLecture?.notes?.url && (
              <div className="w-full ">
                <p>Lecture notes</p>
                <iframe
                  src={currLecture?.notes?.url}
                  frameborder="0"
                  className="w-full h-[22rem] rounded-xl mx-auto"
                ></iframe>
              </div>
            )}
            <FormInput
              label={
                currLecture?.notes?.url
                  ? "New Lecture Notes"
                  : "Add Lecture Notes"
              }
              name="notes"
              type="file"
              accept="pdf"
              onChange={(e) =>
                setCurrLecture({
                  ...currLecture,
                  notes: e.target.files[0],
                })
              }
              disabled={isUploading}
            />
          </div>

          {/* Lecture assignment  */}
          <div className="flex flex-col gap-1">
            {currLecture?.assignment?.url && (
              <div className="w-full ">
                <p>Lecture assignment</p>
                <iframe
                  src={currLecture?.assignment?.url}
                  frameborder="0"
                  className="w-full h-[22rem] rounded-xl mx-auto"
                ></iframe>
              </div>
            )}
            <FormInput
              label={
                currLecture?.assignment?.url
                  ? "New Lecture Assignment"
                  : "Add Lecture Assignment"
              }
              name="assignment"
              type="file"
              accept="pdf/*"
              onChange={(e) =>
                setCurrLecture({
                  ...currLecture,
                  assignment: e.target.files[0],
                })
              }
              disabled={isUploading}
            />
          </div>
          {/*Form btns  */}
          <div className="flex gap-4">
            <FormButton type="submit" disabled={isLoading || isUploading}>
              Update
            </FormButton>
            <FormButton
              onClick={discardChanges}
              disabled={isLoading || isUploading}
            >
              Discard
            </FormButton>
          </div>
        </form>
      </div>

      {/* Lectures  */}
      <div className="flex flex-col gap-2 w-full bg-light-card dark:bg-dark-subcard rounded-lg py-4 shadow-md lg:min-w-[20rem] lg:w-[20rem] lg:rounded-xl ">
        {/* heading  */}
        <span className="flex justify-between items-center px-4 lg:border-b-1 lg:border-gray-300 lg:dark:border-gray-600 lg:pb-2">
          <h3 className="text-xl">All Lectures</h3>
          <Link
            className="cursor-pointer p-1 rounded-lg hover:bg-main/10 dark:hover:bg-main/20"
            to={`/tutor/courses/${courseId}/lectures/add-lecture`}
          >
            <AddIcon />
          </Link>
        </span>

        {/* Lectures container  */}
        <div
          className={`max-h-[50vh] h-fit overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 lg:h-[calc(100vh-12rem)] ${
            showLectures ? "" : "hidden lg:block"
          } `}
        >
          {lectures.length ? (
            lectures.map((lecture, idx) => {
              return (
                <button
                  className={`flex w-full gap-1 text-left py-2 px-2 cursor-pointer ${
                    lecture._id === lectureId
                      ? "bg-black/20 dark:bg-white/20"
                      : "hover:bg-black/10 dark:hover:bg-white/10"
                  } sm:gap-2 sm:px-4`}
                  key={uuidv4()}
                  onClick={() => setCurrLecture(lecture)}
                >
                  <span className="h-full">{idx + 1}. </span>
                  <img
                    src={lecture.thumbnail.url}
                    alt=""
                    loading="lazy"
                    className="w-30 rounded-lg aspect-video lg:w-24"
                  />
                  <p className="text-sm">{lecture.title}</p>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center">
              No lecture uploaded!
              <Link
                className="w-fit flex gap-2 items-center justify-center flex-wrap rounded-xl p-4 bg-black/30 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/30"
                to={`/tutor/courses/${courseId}/lectures/add-lecture`}
              >
                <AddIcon />
                Click to add Lecture!
              </Link>
            </div>
          )}
        </div>

        <button
          className="text-main hover:underline w-fit mx-4 lg:hidden"
          onClick={() => setShowLectures((prev) => !prev)}
        >
          {showLectures ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}
