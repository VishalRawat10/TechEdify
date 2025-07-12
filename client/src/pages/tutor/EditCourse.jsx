import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

import Loader from "../../components/Loader";
import { getInstructorCourse } from "../../services/utils";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";

export default function EditCourse() {
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState({
    name: course?.name || "",
    profileImg: course?.profileImg || null,
    about: course?.about || "",
    alias: course?.alias || "",
    price: course?.price || "",
  });
  const [chapters, setChapters] = useState(course?.chapters || []); //Course Chapters
  const [newProfileImg, setNewProfileImg] = useState(null);

  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getInstructorCourse(courseId)
      .then((res) => {
        setCourse(res.data.course);
        setChapters(res.data.course.chapters);
        setCourseDetails(res.data.course);
        console.log(res.data.course);
      })
      .catch((err) => {
        console.log(err);
        setMessageInfo(err.response.data.message);
        navigate("/instructor/my-courses");
      })
      .finally((err) => {
        setIsLoading(false);
      });
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
      formData.append("profileImg", newProfileImg);
      formData.append("name", courseDetails.name);
      formData.append("about", courseDetails.about);
      formData.append("alias", courseDetails.alias);
      formData.append("price", courseDetails.price);
      formData.append("chapters", JSON.stringify(chapters)); // Important
      const res = await apiInstance.put(
        `courses/instructor/my-courses/${courseId}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCourse(res.data.course);
      setChapters(res.data.course.chapters);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      console.log(err);
      setMessageInfo(err.response.data.message, true);
    }
    setIsLoading(false);
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
    setCourseDetails({
      name: course?.name || "",
      profileImg: course?.profileImg || null,
      about: course?.about || "",
      alias: course?.alias || "",
      price: course?.price || "",
    });
    setChapters(course?.chapters);
  };

  console.log(chapters);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="px-6 h-[calc(100vh-6rem)]">
      <h2 className="text-2xl font-semibold">Edit Course</h2>
      <div className="grid grid-cols-3 gap-x-4 mt-4">
        {/* Course details  */}
        <form
          className="col-span-2 text-sm flex flex-col gap-2 h-[calc(100vh-8rem)] overflow-auto scrollbar-none"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <div className="w-full flex flex-col">
            <label htmlFor="name">Course name*</label>
            <input
              type="text"
              id="name"
              minLength={6}
              name="name"
              value={courseDetails.name}
              placeholder="A catchy name here"
              className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Course Image  */}
          <div className="relative w-2/3">
            <label>Course image*</label>
            <img
              src={courseDetails.profileImg}
              alt="course profile image"
              className="rounded-lg shadow-md"
            />
            <span className="flex items-center justify-center gap-4 left-4 cursor-pointer p-2 border-2 mt-4 rounded-lg">
              <label
                htmlFor="profileImg"
                className="cursor-pointer border-r-2 pr-2"
              >
                {/* <InsertPhotoIcon fontSize="small" /> */}
                Choose Image
              </label>
              <input
                type="file"
                id="profileImg"
                className="cursor-pointer"
                accept="image/*"
                onChange={(e) => {
                  setNewProfileImg(e.target.files[0]);
                }}
              />
            </span>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="price">Price*</label>
            <input
              type="number"
              id="price"
              min={1}
              name="price"
              value={courseDetails.price}
              placeholder="eg. 400"
              className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="about">About*</label>
            <textarea
              type="text"
              id="about"
              minLength={6}
              rows={5}
              name="about"
              value={courseDetails.about}
              placeholder="A catchy name here"
              className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="alias">Alias*</label>
            <textarea
              type="text"
              id="alias"
              minLength={6}
              rows={5}
              name="alias"
              value={courseDetails.alias}
              placeholder="Write different names which user can search this course with. Separeate each name by space..."
              className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl">Chapters*</h3>
            {chapters?.map((chapter, idx) => {
              return (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <label htmlFor="" className="col-span-1">
                    Chapter {idx + 1}
                  </label>
                  <DeleteIcon
                    fontSize="small"
                    className="justify-self-end cursor-pointer"
                    onClick={() =>
                      setChapters(
                        chapters.filter(
                          (chapter) => chapters.indexOf(chapter) !== idx
                        )
                      )
                    }
                  />
                  <input
                    type="text"
                    id="name"
                    minLength={6}
                    name="name"
                    value={chapter.name}
                    placeholder="Enter chapter name..."
                    className="h-fit border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                    required
                    onChange={(e) =>
                      handleChaptersChange(idx, e.target.name, e.target.value)
                    }
                  />
                  <textarea
                    type="text"
                    id="alias"
                    minLength={6}
                    rows={3}
                    name="content"
                    value={chapter.content}
                    placeholder="Write the chapter content here..."
                    className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                    required
                    onChange={(e) =>
                      handleChaptersChange(idx, e.target.name, e.target.value)
                    }
                  />{" "}
                </div>
              );
            })}
            <button
              className="mt-2 py-2 bg-black/30 dark:bg-white/30 rounded-lg flex gap-2 justify-center items-center font-semibold cursor-pointer hover:opacity-80"
              onClick={(e) => {
                e.preventDefault();
                setChapters([...chapters, { name: "", content: "" }]);
              }}
            >
              <AddIcon />
              Add Chapter
            </button>
          </div>
          <div className="flex gap-4 ml-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg hover:rounded-full bg-amber-600 cursor-pointer text-white font-semibold "
            >
              Update
            </button>
            <button
              type="reset"
              className="px-6 py-2 rounded-lg hover:rounded-full bg-amber-600 cursor-pointer text-white font-semibold"
              onClick={discardChanges}
            >
              Discard
            </button>
          </div>
        </form>
        {/* course lectures */}
        <div className="col-span-1 h-[calc(100vh-8rem)] overflow-auto bg-white dark:bg-[var(--dark-bg-2)] rounded-xl px-4 py-2 shadow-md relative scrollbar-thin">
          <span className="flex justify-between items-center font-semibold">
            <h3>Lectures({course?.lectures?.length})</h3>
            <Link
              to={`/instructor/my-courses/${courseId}/add-lecture`}
              title="Add new lecture"
              className="hover:opacity-85"
            >
              <AddIcon />
            </Link>
          </span>

          {course?.lectures?.length ? (
            <div className="flex flex-col h-[calc(100%-8rem)] w-full gap-2">
              {course?.lectures?.map((lecture, idx) => {
                return (
                  <Link
                    key={idx}
                    className="grid grid-cols-6 dark:hover:bg-white/20 hover:bg-black/20 px-2 py-2 gap-2"
                    style={{ transition: "background 0.2s linear" }}
                  >
                    <img
                      src={lecture?.thumbnail?.url}
                      alt={`lecture${idx + 1}`}
                      className="col-span-2 aspect-video rounded"
                    />
                    <p className="col-span-4 text-sm">{lecture.title}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className=" flex flex-col items-center justify-center w-full text-2xl h-[calc(100vh-11rem)]">
              NO LECTURES!
            </div>
          )}
          <Link
            to={`/instructor/my-courses/${courseId}/add-lecture`}
            className="flex flex-col items-center bg-black/30 text-lg px-4 py-2 rounded-lg"
          >
            CLICK TO ADD LECTURE
            <AddIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
