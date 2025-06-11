import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiInstance } from "../../services/apis";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function AddLecture() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [lectureDetails, setLectureDetails] = useState({
    title: "",
    description: "",
    thumbnail: null,
    video: null,
    notes: null,
    assignment: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    apiInstance
      .get(`courses/instructor/my-courses/${courseId}`)
      .then((res) => setCourse(res.data.course))
      .catch((err) => {
        setMessageInfo(err.response.data.message, true);
        navigate(-1);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleInputChange = (e) => {
    if (e.target.type === "text" || e.target.type === "textarea") {
      setLectureDetails({ ...lectureDetails, [e.target.name]: e.target.value });
    } else {
      setLectureDetails({
        ...lectureDetails,
        [e.target.name]: e.target.files[0],
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", lectureDetails.title);
    formData.append("description", lectureDetails.description);
    formData.append("lectureVideo", lectureDetails.video);
    formData.append("thumbnail", lectureDetails.thumbnail);
    if (lectureDetails.notes) formData.append("notes", lectureDetails.notes);
    if (lectureDetails.assignment)
      formData.append("assignment", lectureDetails.assignment);

    apiInstance
      .post(`/courses/${courseId}/instructor/lectures`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setMessageInfo("Lecture uploaded successfully.", false);
        navigate(`/instructor/my-courses/${courseId}`);
      })
      .catch((err) => setMessageInfo(err.response.data.message))
      .finally(() => setIsLoading(false));
  };

  console.log(lectureDetails);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="w-fit text-3xl font-semibold ">{course?.name}</h1>
      <h3 className="w-2/3 text-lg font-semibold">Add Lecture</h3>
      <form
        className="w-2/3 h-[calc(100vh-9rem)] text-sm flex flex-col gap-2 overflow-auto scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-transparent pb-6"
        onSubmit={handleFormSubmit}
      >
        <div className="w-full flex flex-col">
          <label htmlFor="title">Lecture title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={lectureDetails?.title}
            placeholder="Enter lecture title ..."
            className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
            required
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="description">Lecture description*</label>
          <textarea
            type="text"
            id="description"
            name="description"
            rows={5}
            value={lectureDetails?.description}
            placeholder="Write the description about the lecture..."
            className=" border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white overflow-auto scrollbar-none"
            required
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="video">Lecture video*</label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
            required
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="thumbnail">Lecture thumbnail*</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
            required
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="notes">Lecture notes</label>
          <input
            type="file"
            id="notes"
            name="notes"
            accept=".pdf, .docx"
            className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>{" "}
        <div className="w-full flex flex-col">
          <label htmlFor="assignment">Lecture assignment</label>
          <input
            type="file"
            id="assignment"
            name="assignment"
            accept=".pdf, .docx"
            className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 w-fit rounded-lg bg-green-400 cursor-pointer hover:opacity-80"
          style={{ transition: "opacity 0.3s linear" }}
        >
          Upload
        </button>
      </form>
    </div>
  );
}
