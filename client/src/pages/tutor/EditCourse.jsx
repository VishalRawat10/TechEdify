import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  FormButton,
  FormInput,
  FormOption,
  FormSelect,
  FormTextarea,
  AddChapterBtn,
} from "../../components/FormComponents";

import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";
import { TutorContext } from "../../context/TutorContext";
import { validateChapters, validateCourseDetails } from "../../services/utils";

export default function EditCourse() {
  const { courseId } = useParams();
  const { setIsLoading, isLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});
  const [chapters, setChapters] = useState([]);
  const [showLectures, setShowLectures] = useState(false);
  const [preview, setPreview] = useState("");

  // Fetch course details
  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/tutors/courses/${courseId}`);
        const courseData = res.data.course;
        setCourse(courseData);
        setCourseDetails(courseData);
        setChapters(courseData.chapters || []);
        setPreview(courseData.thumbnail?.url || "");
      } catch (err) {
        setMessageInfo(
          err.response?.data?.message || "Failed to fetch course details!",
          true
        );
      } finally {
        setIsLoading(false);
      }
    };
    getCourse();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  // Handle file selection with live preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCourseDetails({ ...courseDetails, thumbnail: file });
    setPreview(URL.createObjectURL(file));
  };

  // Handle chapter input changes
  const handleChaptersChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  // Discard changes
  const discardChanges = (e) => {
    e.preventDefault();
    setCourseDetails(course);
    setChapters(course?.chapters || []);
    setPreview(course?.thumbnail?.url || "");
  };

  // Submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateCourseDetails(courseDetails);
    const chapterErrors = validateChapters(chapters);
    if (errors.isError || chapterErrors.isError) {
      setMessageInfo("Please fix form errors before submitting.", true);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(courseDetails).forEach(([key, value]) => {
        if (key === "thumbnail" && value instanceof File) {
          formData.append("thumbnail", value);
        } else if (typeof value !== "object") {
          formData.append(key, value);
        }
      });
      formData.append("chapters", JSON.stringify(chapters));

      const res = await apiInstance.put(
        `/tutors/courses/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCourseDetails(res.data.course);
      setMessageInfo("Course updated successfully!", false);
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Failed to update course!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseDelete = async (e) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setIsLoading(true);
    try {
      const res = await apiInstance.delete(`/tutors/courses/${courseId}`);
      setMessageInfo("Course deleted successfully!", false);
      navigate(-1);
    } catch (err) {
      setMessageInfo(err.response.data.message || "Failed to delete course!");
      console.log("Error is: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const errors = validateCourseDetails(courseDetails);
  const chapterErrors = validateChapters(chapters);

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] py-4 px-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 gap-4 sm:px-10 lg:flex-row lg:px-2 lg:gap-0">
      {/* Edit Course Form */}
      <div className="rounded-xl w-full mx-auto lg:px-6 xl:w-[60rem]">
        <div className="flex justify-between items-center">
          <h1 className="text-lg flex gap-2 items-center text-main font-semibold sm:text-2xl">
            <EditIcon />
            Edit — {course?.title}
          </h1>
          <button
            className="cursor-pointer hover:bg-red-600/10 p-1 rounded-lg "
            onClick={handleCourseDelete}
          >
            <DeleteIcon />
          </button>
        </div>

        <form
          className="flex flex-col gap-6 mt-4 h-fit overflow-y-auto scrollbar-none lg:h-[calc(100vh-9rem)]"
          onSubmit={handleFormSubmit}
        >
          <FormInput
            label="Course Title"
            required
            maxLength={50}
            value={courseDetails.title || ""}
            name="title"
            placeholder="Enter course title"
            errMsg={errors.title}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-2">
            <p className="font-medium">Course Thumbnail</p>
            {preview && (
              <img
                src={preview}
                alt="Course Thumbnail"
                className="rounded-xl w-full max-h-[300px] object-cover"
                loading="lazy"
              />
            )}
            <FormInput
              label="Upload New Thumbnail"
              type="file"
              accept="image/*"
              name="thumbnail"
              onChange={handleThumbnailChange}
              disabled={isLoading}
            />
          </div>

          <FormInput
            label="Course Price"
            required
            type="number"
            min={10}
            value={courseDetails.price || ""}
            name="price"
            placeholder="e.g. 999"
            errMsg={errors.price}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <FormTextarea
            label="Course Description"
            required
            value={courseDetails.description || ""}
            name="description"
            placeholder="Write about your course..."
            errMsg={errors.description}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <FormInput
            label="Course Alias"
            required
            value={courseDetails.alias || ""}
            name="alias"
            placeholder="e.g. web-development"
            errMsg={errors.alias}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <FormSelect
            label="Status"
            name="courseStatus"
            value={courseDetails.courseStatus || ""}
            required
            onChange={handleInputChange}
            errMsg={errors.type}
            disabled={isLoading}
          >
            <FormOption value="upcoming">Upcoming</FormOption>
            <FormOption value="ongoing">Ongoing</FormOption>
            <FormOption value="completed">Completed</FormOption>
          </FormSelect>

          {/* Chapters Section */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Chapters*</h3>
            {!chapters.length && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Your course must have at least one chapter.
              </p>
            )}

            <div className="flex flex-col gap-6">
              {chapters.map((chapter, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative"
                >
                  <FormInput
                    label={`Chapter ${idx + 1}`}
                    name="name"
                    minLength={3}
                    value={chapter.name || ""}
                    placeholder="Enter chapter name..."
                    onChange={(e) =>
                      handleChaptersChange(idx, e.target.name, e.target.value)
                    }
                    errMsg={chapterErrors.chapters[idx]?.name}
                  >
                    <DeleteIcon
                      fontSize="small"
                      className="absolute right-2 top-2 cursor-pointer text-red-500 hover:text-red-600"
                      onClick={() =>
                        setChapters((prev) => prev.filter((_, i) => i !== idx))
                      }
                    />
                  </FormInput>
                  <FormTextarea
                    name="content"
                    minLength={6}
                    rows={3}
                    value={chapter.content || ""}
                    placeholder="Write subtopics separated by commas (,)..."
                    onChange={(e) =>
                      handleChaptersChange(idx, e.target.name, e.target.value)
                    }
                    errMsg={chapterErrors.chapters[idx]?.content}
                  />
                </div>
              ))}

              <AddChapterBtn
                chapters={chapters}
                setChapters={setChapters}
                isLoading={isLoading}
                chapterErrors={chapterErrors}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <FormButton type="submit" disabled={isLoading}>
              Update
            </FormButton>
            <FormButton onClick={discardChanges} disabled={isLoading}>
              Discard
            </FormButton>
          </div>
        </form>
      </div>

      {/* Lectures Sidebar */}
      <aside className="flex flex-col gap-2 w-full bg-light-card dark:bg-dark-subcard rounded-lg py-4 shadow-md lg:min-w-[20rem] lg:w-[20rem] lg:rounded-xl">
        <header className="flex justify-between items-center px-4 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="text-xl font-semibold">Lectures</h3>
          <Link
            className="cursor-pointer p-1 rounded-lg hover:bg-main/10 dark:hover:bg-main/20"
            to={`/tutor/courses/${courseId}/lectures/add-lecture`}
          >
            <AddIcon />
          </Link>
        </header>

        <div
          className={`max-h-[50vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 lg:h-[calc(100vh-12rem)] ${
            showLectures ? "" : "hidden lg:block"
          }`}
        >
          {course?.lectures?.length ? (
            course.lectures.map((lecture, idx) => (
              <Link
                key={uuidv4()}
                className="flex gap-2 text-left hover:bg-black/10 dark:hover:bg-white/10 py-2 px-3"
                to={`/tutor/courses/${courseId}/lectures?lecture=${idx + 1}`}
              >
                <span>{idx + 1}.</span>
                <img
                  src={lecture.thumbnail.url}
                  alt="Lecture thumbnail"
                  className="w-24 rounded-md aspect-video object-cover"
                />
                <p className="text-sm truncate">{lecture.title}</p>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-sm">
              No lectures yet.
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
      </aside>
    </div>
  );
}
