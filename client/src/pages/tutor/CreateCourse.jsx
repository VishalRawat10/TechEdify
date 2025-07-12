import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import Loader from "../../components/Loader";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/axios.config";

export default function CreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    about: "",
    alias: "",
    price: "",
  });
  const [chapters, setChapters] = useState([]); //Course Chapters
  const [profileImg, setProfileImg] = useState("");

  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

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

  //handleProfileImgChange
  const handleProfileImgChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  //create course
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("profileImg", profileImg);
      formData.append("name", courseDetails.name);
      formData.append("about", courseDetails.about);
      formData.append("alias", courseDetails.alias);
      formData.append("price", courseDetails.price);
      formData.append("chapters", JSON.stringify(chapters)); // Important

      const res = await apiInstance.post(
        "/courses/instructor/my-courses/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      discardChanges(e);
      setMessageInfo("Course created successfully.", false);
      navigate("/instructor/my-courses");
    } catch (err) {
      console.log(err);
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
      name: "",
      about: "",
      alias: "",
      price: "",
    });
    setChapters([]);
    setProfileImg(null);
  };

  return (
    <>
      {isLoading ? <Loader /> : ""}

      <div className="px-6 h-[calc(100vh-6rem)] rounded-xl mx-auto w-2/3">
        <h2 className="text-2xl font-semibold">Create Course</h2>
        <div className="grid grid-cols-1 gap-x-4 mt-4">
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
                name="name"
                value={courseDetails.name}
                placeholder="A catchy name here"
                className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                required
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            {/* Course Image  */}
            <div className="">
              <label>Course image*</label>
              <span className="flex items-center gap-4 left-4 cursor-pointer p-2 rounded-lg border-1 border-white dark:border-black px-4 py-2 text-sm  bg-white dark:bg-[var(--dark-bg-2)] shadow-md ">
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
                  className="cursor-pointer w-max"
                  accept="image/*"
                  onChange={handleProfileImgChange}
                  disabled={isLoading}
                />
              </span>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="price">Price*</label>
              <input
                type="text"
                id="price"
                name="price"
                value={courseDetails.price}
                placeholder="eg. 1000"
                className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                required
                onChange={handleInputChange}
                disabled={isLoading}
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
                placeholder="Write about your course..."
                className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                required
                onChange={handleInputChange}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <h3 className="text-xl">Chapters*</h3>
              {chapters.map((chapter, idx) => {
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
                      disabled={isLoading}
                    />
                    <textarea
                      type="text"
                      id="alias"
                      minLength={6}
                      rows={3}
                      name="content"
                      value={chapter.content}
                      placeholder="Write the subtopics of the chapters separated by comma (,)..."
                      className="border-1 border-white dark:border-black px-4 py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 dark:placeholder:text-gray-500 bg-white dark:bg-[var(--dark-bg-2)] shadow-md focus:border-black dark:focus:border-white"
                      required
                      onChange={(e) =>
                        handleChaptersChange(idx, e.target.name, e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                );
              })}
              <button
                className="mt-2 py-2 bg-black/30 dark:bg-white/30 rounded-lg flex gap-2 justify-center items-center font-semibold cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.preventDefault();
                  setChapters([...chapters, { name: "", content: "" }]);
                }}
                disabled={isLoading}
              >
                <AddIcon />
                Add Chapter
              </button>
            </div>
            <div className="flex gap-4 ml-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg hover:rounded-full bg-amber-600 cursor-pointer text-white font-semibold "
                disabled={isLoading}
              >
                Create
              </button>
              <button
                type="reset"
                className="px-6 py-2 rounded-lg hover:rounded-full bg-amber-600 cursor-pointer text-white font-semibold"
                disabled={isLoading}
                onClick={discardChanges}
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
