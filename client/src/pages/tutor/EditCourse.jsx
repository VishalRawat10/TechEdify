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
  const [course, setCourse] = useState();
  const [courseDetails, setCourseDetails] = useState({});
  const [chapters, setChapters] = useState([]); //Course Chapters
  const [showLectures, setShowLectures] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/tutors/courses/${courseId}`);
        setIsLoading(false);
        setCourse(res.data.course);
        setCourseDetails(res.data.course);
        setChapters(res.data.course.chapters);
      } catch (err) {
        setIsLoading(false);
        setMessageInfo(err.response.data.message, true);
      }
    };
    getCourse();
  }, []);

  //input chnage handler
  const handleInputChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  //formSubmitHandler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (courseDetails.thumbnail) {
        formData.append("thumbnail", courseDetails.thumbnail);
      }
      formData.append("title", courseDetails.title);
      formData.append("description", courseDetails.description);
      formData.append("alias", courseDetails.alias);
      formData.append("price", courseDetails.price);
      formData.append("type", courseDetails.type);
      formData.append("chapters", JSON.stringify(chapters)); // Important

      const res = await apiInstance.put(`/courses/${courseId}`, formData);
      setCourseDetails(res.data.course);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      setMessageInfo(err.response.data.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  //handleChaptersChange
  const handleChaptersChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  //discard function
  const discardChanges = (e) => {
    e.preventDefault();
    setCourseDetails(course);
    setChapters(course?.chapters);
  };

  const errors = validateCourseDetails(courseDetails);
  const chapterErrors = validateChapters(chapters);

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] py-4 px-4 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 gap-4 sm:px-10 lg:flex-row lg:px-2 lg:overflow-hidden lg:gap-0">
      {/* Edit course form  */}
      <div className="rounded-xl  w-full mx-auto lg:px-6 xl:w-[60rem] ">
        <h1 className="text-xl flex gap-2 items-center text-black dark:text-white sm:text-2xl">
          <EditIcon />
          {course?.title}
        </h1>
        <form
          className="flex flex-col gap-6 mt-4 h-fit overflow-y-auto scrollbar-none lg:h-[calc(100vh-9rem)]"
          onSubmit={handleFormSubmit}
        >
          <FormInput
            label="Course Title"
            required={true}
            maxLength={50}
            value={courseDetails.title}
            name="title"
            placeholder="Write the title of your course"
            errMsg={errors.title}
            onChange={handleInputChange}
          />
          <div>
            <p>Course Thumbnail</p>
            <img
              src={courseDetails?.thumbnail?.url}
              alt={`${courseDetails?.title}`}
              loading="lazy"
              className="rounded-xl"
            />
          </div>
          <FormInput
            label="New Thumbnail"
            type="file"
            accept="image/*"
            name="thumbnail"
            errMsg={errors.thumbnail}
            onChange={(e) =>
              setCourseDetails({
                ...courseDetails,
                thumbnail: e.target.files[0],
              })
            }
          />
          <FormInput
            label="Course price"
            required={true}
            type="number"
            min={10}
            value={courseDetails.price}
            name="price"
            placeholder="eg. 999"
            errMsg={errors.price}
            onChange={handleInputChange}
          />
          <FormTextarea
            label="Course Description"
            required={true}
            value={courseDetails.description}
            name="description"
            placeholder="Write about your course..."
            errMsg={errors.description}
            onChange={handleInputChange}
          />
          <FormInput
            label="Course alias"
            required={true}
            value={courseDetails.alias}
            name="alias"
            placeholder="Write alias of your course.."
            errMsg={errors.alias}
            onChange={handleInputChange}
          />
          <FormSelect
            defaultValue="selected"
            label="Type"
            name="type"
            value={courseDetails.type}
            required={true}
            onChange={(e) =>
              setCourseDetails({
                ...courseDetails,
                [e.target.name]: e.target.value,
              })
            }
            errMsg={errors.type}
          >
            <FormOption disabled={true} value="selected">
              Choose the type
            </FormOption>
            <FormOption value="Development">Development</FormOption>
            <FormOption value="Language">Language</FormOption>
            <FormOption value="DSA">DSA</FormOption>
          </FormSelect>
          {/* chapters  */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl">Chapters*</h3>
            {!chapters.length && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Note: Your course must have at least one chapter!
              </p>
            )}
            <div className="flex flex-col gap-6">
              {chapters.map((chapter, idx) => {
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-2 gap-2 relative z-0"
                  >
                    <FormInput
                      label={`Chapter ${idx + 1}`}
                      type="text"
                      id="name"
                      minLength={6}
                      name="name"
                      value={chapter.name}
                      placeholder="Enter chapter name..."
                      onChange={(e) =>
                        handleChaptersChange(idx, e.target.name, e.target.value)
                      }
                      disabled={isLoading}
                      errMsg={chapterErrors.chapters[idx]?.name}
                    >
                      <DeleteIcon
                        fontSize="small"
                        className="absolute cursor-pointer right-0"
                        onClick={() =>
                          setChapters(
                            chapters.filter(
                              (chapter) => chapters.indexOf(chapter) !== idx
                            )
                          )
                        }
                      />
                    </FormInput>
                    <FormTextarea
                      id="alias"
                      minLength={6}
                      rows={3}
                      name="content"
                      value={chapter.content}
                      placeholder="Write the subtopics of the chapters separated by comma (,)..."
                      onChange={(e) =>
                        handleChaptersChange(idx, e.target.name, e.target.value)
                      }
                      disabled={isLoading}
                      className="md:mt-5"
                      errMsg={chapterErrors.chapters[idx]?.content}
                    ></FormTextarea>
                  </div>
                );
              })}
              <AddChapterBtn
                chapters={chapters}
                setChapters={setChapters}
                isLoading={isLoading}
                chapterErrors={chapterErrors}
                disabled={isLoading || chapterErrors.isError}
              />
            </div>
          </div>

          {/*Form btns  */}
          <div className="flex gap-4">
            <FormButton type="submit">Update</FormButton>
            <FormButton onClick={discardChanges}>Discard</FormButton>
          </div>
        </form>
      </div>

      {/* Lectures  */}
      <div className="flex flex-col gap-2 w-full bg-light-card dark:bg-dark-subcard rounded-lg py-4 shadow-md lg:min-w-[20rem] lg:w-[20rem] lg:rounded-xl ">
        {/* heading  */}
        <span className="flex justify-between items-center px-4 lg:border-b-1 lg:border-gray-300 lg:dark:border-gray-600 lg:pb-2">
          <h3 className="text-xl">Lectures</h3>
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
          {course?.lectures?.length ? (
            course?.lectures.map((lecture, idx) => {
              return (
                <Link
                  className="flex gap-1 text-left hover:bg-black/10 dark:hover:bg-white/10 py-2 px-2 sm:gap-2 sm:px-4"
                  key={uuidv4()}
                  to={`/tutor/courses/${courseId}/lectures/${lecture._id}/edit`}
                >
                  <span className="h-full">{idx + 1}. </span>
                  <img
                    src={lecture.thumbnail.url}
                    alt=""
                    loading="lazy"
                    className="w-30 rounded-lg aspect-video lg:w-24"
                  />
                  <p className="text-sm">{lecture.title}</p>
                </Link>
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
