import { useState, useContext, useEffect } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  FormButton,
  FormInput,
  FormOption,
  FormSelect,
  FormTextarea,
  AddChapterBtn,
} from "../../components/FormComponents";

import { MessageContext } from "../../context/MessageContext";
import { TutorContext } from "../../context/TutorContext";
import { apiInstance } from "../../services/axios.config";
import { validateChapters, validateCourseDetails } from "../../services/utils";

export default function CreateCourse() {
  const { isLoading, setIsLoading } = useContext(TutorContext);
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    alias: "",
    price: "",
    type: "selected",
  });
  const [chapters, setChapters] = useState([]); //Course Chapters
  const [thumbnail, setThumbnail] = useState();

  const { setMessageInfo } = useContext(MessageContext);

  //handleInputChnage
  const handleInputChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  //handleChaptersChange
  const handleChaptersChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  //Submit create course form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);
      formData.append("title", courseDetails.title);
      formData.append("description", courseDetails.description);
      formData.append("alias", courseDetails.alias);
      formData.append("price", courseDetails.price);
      formData.append("type", courseDetails.type);
      formData.append("chapters", JSON.stringify(chapters)); // Important

      const res = await apiInstance.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      discardChanges(e);
      setMessageInfo(res.data.message || "Couldn't create course!", false);
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Unable to create course!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  //discard function
  const discardChanges = (e) => {
    e.preventDefault();
    setCourseDetails({
      title: "",
      description: "",
      alias: "",
      price: "",
      type: "selected",
    });
    setChapters([]);
    setThumbnail();
  };

  const errors = validateCourseDetails(courseDetails);
  const chapterErrors = validateChapters(chapters);

  return (
    <>
      <div className="px-4 h-[calc(100vh-4.5rem)] py-6 rounded-xl w-full overflow-y-auto scrollbar-none sm:px-10 lg:w-3/4 mx-auto">
        <h1 className="text-3xl flex gap-2 items-center text-black dark:text-white lg:text-2xl">
          <AddCircleOutlineIcon fontSize="large" />
          Create Course
        </h1>
        <form className="flex flex-col gap-6 mt-4" onSubmit={handleFormSubmit}>
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
          <FormInput
            label="Course Thumbnail"
            type="file"
            required={true}
            accept="image/*"
            name="thumbnail"
            errMsg={errors.thumbnail}
            onChange={(e) => setThumbnail(e.target.files[0])}
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
          <FormInput
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
          <div className="flex gap-4">
            <FormButton type="submit">Create</FormButton>
            <FormButton onClick={discardChanges}>Discard</FormButton>
          </div>
        </form>
      </div>
    </>
  );
}
