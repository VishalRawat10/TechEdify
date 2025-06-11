import { useContext, useState } from "react";
import { apiInstance } from "../../services/apis";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function CreateInstructor() {
  const [instructor, setInstructor] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    messageToStudent: "",
    phone: "",
  });
  const [profileImg, setProfileImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setMessageInfo } = useContext(MessageContext);

  const handleInputChange = (e) => {
    setInstructor({ ...instructor, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", instructor.firstname);
    formData.append("lastname", instructor.lastname);
    formData.append("email", instructor.email);
    formData.append("messageToStudent", instructor.messageToStudent);
    formData.append("password", instructor.password);
    formData.append("phone", instructor.phone);

    setIsLoading(true);

    apiInstance
      .post("/admin/instructors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setMessageInfo("Instructor created successfully.", false);
        navigate("/admin/instructors");
      })
      .catch((err) =>
        setMessageInfo(
          err.response.data.message || "Unable to create instructor.",
          true
        )
      )
      .finally(() => setIsLoading(false));
  };
  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
      <h1 className="w-[80%] text-3xl font-semibold">Create Instructor</h1>
      <form
        className=" w-[80%] grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[var(--dark-bg-2)] p-8 rounded-xl shadow-2xl"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="firstname" className="font-semibold text-sm">
            Firstname*
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            value={instructor.firstname}
            placeholder="Enter the firstname..."
            className="profile-input"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="lastname" className="font-semibold text-sm">
            Lastname
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            value={instructor.lastname}
            placeholder="Enter the lastname..."
            className="profile-input"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="email" className="font-semibold text-sm">
            Email*
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={instructor.email}
            className="profile-input"
            onChange={handleInputChange}
            required
            placeholder="Enter the email..."
          />
        </div>

        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="password" className="font-semibold text-sm">
            Password
          </label>
          <input
            type="text"
            name="password"
            id="password"
            value={instructor.password}
            className="profile-input"
            onChange={handleInputChange}
            required
            placeholder="Enter the temporary password"
          />
        </div>
        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="profileImg" className="font-semibold text-sm">
            Profile image*
          </label>
          <input
            type="file"
            name="profileImg"
            id="profileImg"
            className="profile-input"
            onChange={(e) => setProfileImg(e.target.files[0])}
            required
          />
        </div>
        <div className="flex flex-col col-span-2 md:col-span-1">
          <label htmlFor="phone" className="font-semibold text-sm">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={instructor.phone}
            className="profile-input"
            onChange={handleInputChange}
            placeholder="Enter the contact number with country code..."
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label htmlFor="messageToStudent" className="font-semibold text-sm">
            Message to student
          </label>
          <textarea
            name="messageToStudent"
            id="messageToStudent"
            value={instructor.messageToStudent}
            className="profile-input"
            onChange={handleInputChange}
            rows={5}
            required
            placeholder="Write instructor's message to students..."
          />
        </div>
        <div className="flex gap-1 col-span-2 ">
          <button
            className="cursor-pointer font-semibold px-6 py-2  rounded-lg text-sm bg-green-600 hover:bg-green-700"
            type="submit"
            style={{ transition: "background-color 0.1s linear" }}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
