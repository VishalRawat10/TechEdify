import { useContext, useEffect, useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { TutorContext } from "../../context/TutorContext";
import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import {
  FormInput,
  FormButton,
  FormTextarea,
} from "../../components/FormComponents";

export default function EditLecture() {
  const { setIsLoading, isLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [currLecture, setCurrLecture] = useState();
  const [showLectures, setShowLectures] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // local previews for files
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [notesPreview, setNotesPreview] = useState("");
  const [assignmentPreview, setAssignmentPreview] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await apiInstance.get(
          `/tutors/courses/${courseId}/lectures`
        );
        setLectures(res.data.lectures);
        const idx = searchParams.get("lecture") || 1;
        setCurrLecture(res.data.lectures[idx - 1]);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setMessageInfo(
          err.response?.data?.message || err.message || "Internal server error!"
        );
        navigate("/tutor/courses");
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    setCurrLecture({ ...currLecture, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field, file) => {
    setCurrLecture((prev) => ({ ...prev, [field]: file }));
    if (!file) return;

    const fileURL = URL.createObjectURL(file);

    switch (field) {
      case "thumbnail":
        setThumbnailPreview(fileURL);
        break;
      case "lectureVideo":
        setVideoPreview(fileURL);
        break;
      case "notes":
        setNotesPreview(fileURL);
        break;
      case "assignment":
        setAssignmentPreview(fileURL);
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(currLecture).forEach((key) => {
      if (currLecture[key] && typeof currLecture[key] !== "object") {
        formData.append(key, currLecture[key]);
      } else if (currLecture[key] instanceof File) {
        formData.append(key, currLecture[key]);
      }
    });

    setIsUploading(true);
    try {
      const res = await apiInstance.put(
        `/tutors/courses/${courseId}/lectures/${currLecture._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCurrLecture(res.data.lecture);
      setLectures((prev) =>
        prev.map((lecture) =>
          lecture._id === res.data.lecture._id ? res.data.lecture : lecture
        )
      );
      setIsUploading(false);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
      setMessageInfo(
        err.response?.data?.message || "Unable to update lecture!"
      );
    }
  };

  const discardChanges = (e) => {
    e.preventDefault();
    const lec = lectures.find((l) => l._id === currLecture?._id);
    setCurrLecture(lec);
    setThumbnailPreview("");
    setVideoPreview("");
    setNotesPreview("");
    setAssignmentPreview("");
  };

  const handleLectureDelete = async (e) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    try {
      setIsLoading(true);
      const res = await apiInstance.delete(
        `/tutors/courses/${courseId}/lectures/${currLecture._id}`
      );
      setMessageInfo("Lecture deleted successfully!", false);
    } catch (err) {
      console.log(err);
      setMessageInfo(
        err.response.data.message || "Failed to delete the lecture!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col py-4 px-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 gap-4 sm:px-10 lg:flex-row lg:px-2 lg:overflow-hidden lg:gap-0">
      {/* Edit course form */}
      <div className="rounded-xl w-full mx-auto lg:px-6 xl:w-[60rem] ">
        <h1 className="text-xl flex gap-2 items-center text-main font-semibold sm:text-2xl">
          {currLecture?.course?.title}
        </h1>

        <div className="flex justify-between">
          <div className="text-xl">
            <EditIcon /> Edit Lecture
          </div>
          <button
            className="p-1 hover:bg-red-600/10 rounded-lg cursor-pointer"
            onClick={handleLectureDelete}
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>

        {isUploading && (
          <div className="w-full bg-green-500 dark:bg-green-600 rounded-lg p-4 flex gap-4 items-center text-sm text-white">
            <CircularProgress size={"20px"} color="inherit" /> Uploading files…
          </div>
        )}

        <form
          className="flex flex-col gap-6 h-fit overflow-y-auto scrollbar-none px-2 text-sm py-3 lg:h-[calc(100vh-9rem)]"
          onSubmit={handleFormSubmit}
        >
          <FormInput
            label="Lecture Title"
            name="title"
            value={currLecture?.title || ""}
            placeholder="Enter the lecture title"
            required
            onChange={handleInputChange}
            disabled={isUploading}
          />

          <FormTextarea
            label="Lecture Description"
            name="description"
            value={currLecture?.description || ""}
            placeholder="Enter lecture description"
            required
            onChange={handleInputChange}
            disabled={isUploading}
          />

          {/* Lecture Thumbnail */}
          <div className="flex flex-col gap-2">
            <p className="font-medium">Lecture Thumbnail</p>
            <img
              src={thumbnailPreview || currLecture?.thumbnail?.url}
              alt="Lecture thumbnail"
              className="w-full rounded-xl object-cover"
              loading="lazy"
            />
            <FormInput
              label="Change Thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("thumbnail", e.target.files[0])}
              disabled={isUploading}
            />
          </div>

          {/* Lecture Video */}
          <div className="flex flex-col gap-2">
            <p className="font-medium">Lecture Video</p>
            <video
              src={videoPreview || currLecture?.lectureVideo?.url}
              className="w-full rounded-xl aspect-video object-cover"
              controls
              poster={thumbnailPreview || currLecture?.thumbnail?.url}
            ></video>
            <FormInput
              label="Change Lecture Video"
              name="lectureVideo"
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleFileChange("lectureVideo", e.target.files[0])
              }
              disabled={isUploading}
            />
          </div>

          {/* Lecture Notes */}
          <div className="flex flex-col gap-2">
            <p className="font-medium">Lecture Notes</p>
            {(notesPreview || currLecture?.notes?.url) && (
              <iframe
                src={notesPreview || currLecture?.notes?.url}
                title="Lecture notes preview"
                className="w-full h-[22rem] rounded-xl"
              ></iframe>
            )}
            <FormInput
              label="Change Notes (PDF)"
              name="notes"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange("notes", e.target.files[0])}
              disabled={isUploading}
            />
          </div>

          {/* Lecture Assignment */}
          <div className="flex flex-col gap-2">
            <p className="font-medium">Lecture Assignment</p>
            {(assignmentPreview || currLecture?.assignment?.url) && (
              <iframe
                src={assignmentPreview || currLecture?.assignment?.url}
                title="Lecture assignment preview"
                className="w-full h-[22rem] rounded-xl"
              ></iframe>
            )}
            <FormInput
              label="Change Assignment (PDF)"
              name="assignment"
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                handleFileChange("assignment", e.target.files[0])
              }
              disabled={isUploading}
            />
          </div>

          {/* Buttons */}
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

      {/* Lectures List */}
      <div className="flex flex-col gap-2 w-full bg-light-card dark:bg-dark-subcard rounded-lg py-4 shadow-md lg:min-w-[20rem] lg:w-[20rem] lg:rounded-xl ">
        <span className="flex justify-between items-center px-4 lg:border-b-1 lg:border-gray-300 lg:dark:border-gray-600 lg:pb-2">
          <h3 className="text-xl">All Lectures</h3>
          <Link
            className="cursor-pointer p-1 rounded-lg hover:bg-main/10 dark:hover:bg-main/20"
            to={`/tutor/courses/${courseId}/lectures/add-lecture`}
          >
            <AddIcon />
          </Link>
        </span>

        <div
          className={`max-h-[50vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 lg:h-[calc(100vh-12rem)] ${
            showLectures ? "" : "hidden lg:block"
          }`}
        >
          {lectures.length ? (
            lectures.map((lecture, idx) => (
              <button
                key={uuidv4()}
                className={`flex w-full gap-2 text-left py-2 px-3 cursor-pointer ${
                  lecture._id === currLecture?._id
                    ? "bg-black/20 dark:bg-white/20"
                    : "hover:bg-black/10 dark:hover:bg-white/10"
                }`}
                onClick={() => {
                  setCurrLecture(lecture);
                  setSearchParams({ lecture: idx + 1 });
                  setThumbnailPreview("");
                  setVideoPreview("");
                  setNotesPreview("");
                  setAssignmentPreview("");
                }}
              >
                <span>{idx + 1}.</span>
                <img
                  src={lecture.thumbnail.url}
                  alt=""
                  loading="lazy"
                  className="w-28 rounded-md aspect-video object-cover"
                />
                <p className="text-sm truncate">{lecture.title}</p>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-sm">
              No lecture uploaded!
              <Link
                className="flex items-center gap-2 mt-2 bg-black/30 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/30 px-4 py-2 rounded-lg"
                to={`/tutor/courses/${courseId}/lectures/add-lecture`}
              >
                <AddIcon /> Add Lecture
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
