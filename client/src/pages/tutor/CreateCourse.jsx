import { useState, useContext } from "react";
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
  const { setMessageInfo } = useContext(MessageContext);

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    alias: "",
    price: "",
  });
  const [chapters, setChapters] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle text input changes
  const handleInputChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  // Handle thumbnail upload with live preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle chapter changes
  const handleChaptersChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  // Submit course creation
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
      if (thumbnail) formData.append("thumbnail", thumbnail);
      Object.entries(courseDetails).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("chapters", JSON.stringify(chapters));

      const res = await apiInstance.post("/tutors/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessageInfo(res.data.message || "Course created successfully!", false);
      discardChanges();
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Failed to create course!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const discardChanges = (e) => {
    if (e) e.preventDefault();
    setCourseDetails({
      title: "",
      description: "",
      alias: "",
      price: "",
      type: "selected",
    });
    setChapters([]);
    setThumbnail(null);
    setPreview(null);
  };

  const errors = validateCourseDetails(courseDetails);
  const chapterErrors = validateChapters(chapters);

  return (
    <div className="px-4 py-6 h-[calc(100vh-4.5rem)] rounded-xl w-full overflow-y-auto scrollbar-none sm:px-10 lg:w-3/4 mx-auto">
      <h1 className="text-3xl flex gap-2 items-center text-black dark:text-white lg:text-2xl">
        <AddCircleOutlineIcon fontSize="large" />
        Create Course
      </h1>

      <form className="flex flex-col gap-6 mt-4" onSubmit={handleFormSubmit}>
        {/* Title */}
        <FormInput
          label="Course Title"
          required
          maxLength={50}
          value={courseDetails.title}
          name="title"
          placeholder="Write the title of your course"
          errMsg={errors.title}
          onChange={handleInputChange}
        />

        {/* Thumbnail upload + preview */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Course Thumbnail</p>
          {preview && (
            <img
              src={preview}
              alt="Thumbnail Preview"
              className="rounded-xl w-full max-h-[300px] object-cover"
              loading="lazy"
            />
          )}
          <FormInput
            label="Upload Thumbnail"
            type="file"
            required
            accept="image/*"
            name="thumbnail"
            errMsg={errors.thumbnail}
            onChange={handleThumbnailChange}
          />
        </div>

        {/* Price */}
        <FormInput
          label="Course Price"
          required
          type="number"
          min={10}
          value={courseDetails.price}
          name="price"
          placeholder="e.g. 999"
          errMsg={errors.price}
          onChange={handleInputChange}
        />

        {/* Description */}
        <FormTextarea
          label="Course Description"
          required
          value={courseDetails.description}
          name="description"
          placeholder="Write about your course..."
          errMsg={errors.description}
          onChange={handleInputChange}
        />

        {/* Alias */}
        <FormInput
          label="Course Alias"
          required
          value={courseDetails.alias}
          name="alias"
          placeholder="Enter a unique alias for your course"
          errMsg={errors.alias}
          onChange={handleInputChange}
        />

        {/* Chapters */}
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Chapters*</h3>
          {!chapters.length && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Note: Your course must have at least one chapter!
            </p>
          )}

          <div className="flex flex-col gap-6">
            {chapters.map((chapter, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-0"
              >
                <FormInput
                  label={`Chapter ${idx + 1}`}
                  type="text"
                  name="name"
                  minLength={6}
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
                  value={chapter.content}
                  placeholder="Write subtopics separated by commas (,)..."
                  onChange={(e) =>
                    handleChaptersChange(idx, e.target.name, e.target.value)
                  }
                  disabled={isLoading}
                  errMsg={chapterErrors.chapters[idx]?.content}
                />
              </div>
            ))}

            <AddChapterBtn
              chapters={chapters}
              setChapters={setChapters}
              isLoading={isLoading}
              chapterErrors={chapterErrors}
              disabled={isLoading || chapterErrors.isError}
            />
          </div>
        </div>

        {/* Form buttons */}
        <div className="flex gap-4">
          <FormButton type="submit" disabled={isLoading}>
            Create
          </FormButton>
          <FormButton onClick={discardChanges} disabled={isLoading}>
            Discard
          </FormButton>
        </div>
      </form>
    </div>
  );
}
