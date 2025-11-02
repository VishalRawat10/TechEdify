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
  const { setMessageInfo } = useContext(MessageContext);

  const [isUploading, setIsUploading] = useState(false);
  const [course, setCourse] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    title: "",
    description: "",
    thumbnail: null,
    lectureVideo: null,
    notes: null,
    assignment: null,
  });

  const [preview, setPreview] = useState({
    thumbnail: "",
    video: "",
    notes: "",
    assignment: "",
  });

  // Fetch course info
  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/tutors/courses/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        setMessageInfo(
          err.response?.data?.message || "Failed to load course!",
          true
        );
      } finally {
        setIsLoading(false);
      }
    };
    getCourse();
  }, []);

  // Handle text input
  const handleInputChange = (e) => {
    setLectureDetails({ ...lectureDetails, [e.target.name]: e.target.value });
  };

  // Handle file input + previews
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    setLectureDetails((prev) => ({ ...prev, [name]: file }));

    const type = file.type;
    if (type.includes("image")) {
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else if (type.includes("video")) {
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else if (type.includes("pdf")) {
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  // Submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLecture(lectureDetails);
    if (errors.isError) {
      setMessageInfo("Please fix form errors before submitting.", true);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      Object.entries(lectureDetails).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await apiInstance.post(
        `/courses/${courseId}/lectures`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessageInfo(
        res.data.message || "Lecture uploaded successfully!",
        false
      );
      handleDiscard();
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Failed to upload lecture!",
        true
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const handleDiscard = (e) => {
    if (e) e.preventDefault();
    setLectureDetails({
      title: "",
      description: "",
      thumbnail: null,
      lectureVideo: null,
      notes: null,
      assignment: null,
      status: "unpublished",
    });
    setPreview({
      thumbnail: "",
      video: "",
      notes: "",
      assignment: "",
    });
  };

  const errors = validateLecture(lectureDetails);

  return (
    <div className="px-4 h-[calc(100vh-4.5rem)] py-6 flex flex-col gap-4 lg:w-[746px] lg:mx-auto">
      {/* Heading */}
      <header>
        <h1 className="font-semibold text-xl lg:text-2xl">{course?.title}</h1>
        <div className="flex gap-2 items-center mt-1">
          <AddCircleOutlineIcon fontSize="small" />
          <h3 className="text-lg lg:text-xl">Add Lecture</h3>
        </div>
      </header>

      {/* Uploading animation */}
      {isUploading && (
        <div className="w-full bg-green-500 dark:bg-green-600 rounded-lg p-4 flex gap-4 items-center text-sm text-white">
          <CircularProgress size={"20px"} color="inherit" /> Lecture is
          uploading! Please wait...
        </div>
      )}

      {/* Lecture Form */}
      <form
        className="grid grid-cols-1 gap-6 h-[calc(100vh-12rem)] overflow-auto scrollbar-none pb-6"
        onSubmit={handleFormSubmit}
      >
        {/* Lecture title */}
        <FormInput
          label="Lecture Title"
          placeholder="Enter the lecture title..."
          value={lectureDetails.title}
          name="title"
          onChange={handleInputChange}
          required
          disabled={isUploading}
          minLength={10}
          errMsg={errors.title}
        />

        {/* Description */}
        <FormTextarea
          label="Lecture Description"
          placeholder="Write the lecture description..."
          value={lectureDetails.description}
          name="description"
          onChange={handleInputChange}
          disabled={isUploading}
          required
          minLength={20}
          errMsg={errors.description}
        />

        {/* Thumbnail */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Lecture Thumbnail</p>
          {preview.thumbnail && (
            <img
              src={preview.thumbnail}
              alt="Lecture Thumbnail Preview"
              className="rounded-xl w-full max-h-[300px] object-cover"
            />
          )}
          <FormInput
            label="Upload Thumbnail"
            type="file"
            accept="image/*"
            name="thumbnail"
            onChange={handleFileChange}
            disabled={isUploading}
            required
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Lecture Notes</p>
          {preview.notes && (
            <iframe
              src={preview.notes}
              className="w-full h-[300px] rounded-lg"
              title="Notes Preview"
            ></iframe>
          )}
          <FormInput
            disabled={isUploading}
            label="Upload Notes (PDF)"
            type="file"
            accept="application/pdf"
            name="notes"
            onChange={handleFileChange}
          />
        </div>

        {/* Assignment */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Lecture Assignment</p>
          {preview.assignment && (
            <iframe
              src={preview.assignment}
              className="w-full h-[300px] rounded-lg"
              title="Assignment Preview"
            ></iframe>
          )}
          <FormInput
            disabled={isUploading}
            label="Upload Assignment (PDF)"
            type="file"
            accept="application/pdf"
            name="assignment"
            onChange={handleFileChange}
          />
        </div>

        {/* Video */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Lecture Video</p>
          {preview.lectureVideo && (
            <video
              src={preview.lectureVideo}
              controls
              className="rounded-xl w-full aspect-video"
            />
          )}
          <FormInput
            disabled={isUploading}
            label="Upload Video"
            type="file"
            accept="video/*"
            name="lectureVideo"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Buttons */}
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
  );
}
