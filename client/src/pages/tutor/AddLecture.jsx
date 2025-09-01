import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TutorContext } from "../../context/TutorContext";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";
import {
  FormButton,
  FormInput,
  FormOption,
  FormSelect,
  FormTextarea,
} from "../../components/FormComponents";
import { validateLecture } from "../../services/utils";

export default function AddLecture() {
  const { courseId } = useParams();
  const { setIsLoading } = useContext(TutorContext);
  const [isUploading, setIsUploading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);
  const [course, setCourse] = useState();
  const [lectureDetails, setLectureDetails] = useState({
    title: "",
    description: "",
    thumbnail: null,
    lectureVideo: null,
    notes: null,
    assignment: null,
    status: "unpublished",
  });

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/tutors/courses/${courseId}`);
        setIsLoading(false);
        setCourse(res.data.course);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        setMessageInfo(err.response.data.message, true);
      }
    };
    getCourse();
  }, []);

  //Input change handler
  const handleInputChange = (e) => {
    setLectureDetails({ ...lectureDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", lectureDetails.title);
      formData.append("description", lectureDetails.description);
      formData.append("lectureVideo", lectureDetails.lectureVideo);
      formData.append("thumbnail", lectureDetails.thumbnail);
      formData.append("status", lectureDetails.status);
      if (lectureDetails.assignment) {
        formData.append("assignment", lectureDetails.assignment);
      }
      if (lectureDetails.notes) {
        formData.append("notes", lectureDetails.notes);
      }
      setIsUploading(true);
      const res = await apiInstance.post(
        `/courses/${courseId}/lectures`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsUploading(false);
      setMessageInfo(
        res.data.message || "Lecture uploaded successfully!",
        false
      );
    } catch (err) {
      console.log(err);
      setIsUploading(false);
      setMessageInfo(err.response.data.message || "Unable to upload lecture!");
    }
  };

  //Discard all
  const handleDiscard = (e) => {
    e.preventDefault();
    setLectureDetails({
      title: "",
      description: "",
      thumbnail: null,
      video: null,
      notes: null,
      assignment: null,
    });
  };

  const errors = validateLecture(lectureDetails);

  return (
    <div className="px-2 h-[calc(100vh-4.5rem)] py-4 flex flex-col gap-4 lg:w-[746px] lg:mx-auto ">
      {/* Heading  */}
      <div>
        <h1 className="font-semibold text-xl lg:text-2xl">{course?.title}</h1>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <AddCircleOutlineIcon fontSize="small" />
          <h3 className=" text-lg lg:text-xl">Add Lecture</h3>
        </div>

        {/* Uploading animation  */}
        {isUploading && (
          <div className="w-full bg-green-500 dark:bg-green-600 rounded-lg p-4 flex gap-4 items-center text-sm text-white">
            <CircularProgress size={"20px"} color="white" /> Lecture is
            uploading! Do not exit or logout!
          </div>
        )}
        {/* Add lecture form  */}
        <form
          className="grid grid-cols-1 gap-4 h-[calc(100vh-12rem)] overflow-auto scrollbar-none pb-6"
          onSubmit={handleFormSubmit}
        >
          <FormInput
            label="Lecture title"
            placeholder="Enter the lecture title..."
            value={lectureDetails.title}
            name="title"
            onChange={handleInputChange}
            required={true}
            disabled={isUploading}
            minLength={10}
            errMsg={errors.title}
          />
          <FormTextarea
            label="Lecture Description"
            placeholder="Write the lecture description..."
            value={lectureDetails.description}
            name="description"
            onChange={handleInputChange}
            disabled={isUploading}
            required={true}
            minLength={20}
            errMsg={errors.description}
          ></FormTextarea>
          <FormInput
            label="Lecture Thumbnail"
            type="file"
            accept="image/*"
            name="thumbnail"
            onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                thumbnail: e.target.files[0],
              })
            }
            disabled={isUploading}
            required={true}
          />
          <FormInput
            disabled={isUploading}
            label="Lecture notes"
            type="file"
            accept="pdf/*"
            name="notes"
            onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                notes: e.target.files[0],
              })
            }
          />
          <FormInput
            disabled={isUploading}
            label="Lecture assignment"
            type="file"
            accept="pdf/*"
            name="assignment"
            onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                assignment: e.target.files[0],
              })
            }
          />
          <FormInput
            disabled={isUploading}
            label="Lecture video"
            type="file"
            accept="video/*"
            name="lectureVideo"
            onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                lectureVideo: e.target.files[0],
              })
            }
            required={true}
          />
          <FormSelect
            value={lectureDetails.status}
            label="Lecture status"
            onChange={handleInputChange}
            name="status"
          >
            <FormOption value={"published"}>Publish</FormOption>
            <FormOption value={"unpublished"}>Unpublish</FormOption>
          </FormSelect>

          {/* Form Buttons  */}
          <div className="flex gap-4 px-2">
            <FormButton type="submit" disabled={isUploading || errors.isError}>
              Upload
            </FormButton>
            <FormButton onClick={handleDiscard} disabled={isUploading}>
              Discard
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
}
