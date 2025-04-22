import { useContext, useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import { apiInstance } from "../../services/apis";
import { getMaxDob } from "../../services/utils";
import Loader from "../components/Loader";

export default function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);

  const [userPersonalDetails, setUserPersonalDetails] = useState({
    firstname: user?.fullname?.firstname,
    lastname: user?.fullname?.lastname,
    email: user?.email,
    DOB: user?.DOB,
    phone: user?.phone,
    address: user?.address,
    about: user?.about,
  });

  //Show profile photo functionality
  useEffect(() => {
    if (showPhoto) {
      document.querySelector("#root").style.overflow = "hidden";
      document.querySelector("#root").style.height = "100vh";
    } else {
      document.querySelector("#root").removeAttribute("style");
    }
  }, [showPhoto]);

  //Upload Profile Image
  const profileImgUpload = async (e) => {
    if (!e.target.files[0] || isLoading) return;
    setShowPhoto(false);
    const formData = new FormData();
    formData.append("profileImg", e.target.files[0]);
    try {
      setIsLoading(true);
      const res = await apiInstance.put("/user/profile/profileImg", formData);
      setUser(res.data.user);
      setIsLoading(false);
      setMessageInfo("Profile Photo uploaded successfully!", false);
    } catch (err) {
      console.err(err);
      setMessageInfo("Unable to upload prfile photo!", true);
    }
  };

  // Delete Profile Photo
  const deleteProfileImg = async (e) => {
    if (isLoading) return;
    setShowPhoto(false);
    try {
      setIsLoading(true);
      const res = await apiInstance.delete("/user/profile/profileImg");
      setUser(res.data.user);
      setIsLoading(false);
      setMessageInfo("Profile Photo deleted!", false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      setMessageInfo("Unable to delete profile photo.", true);
    }
  };

  // Handle PersonalDetails Change
  const handleInputChange = (e) => {
    if (isLoading) return;
    setUserPersonalDetails({
      ...userPersonalDetails,
      [e.target.name]: e.target.value,
    });
  };

  //Update Changes
  const updateChanges = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await apiInstance.put("/user/profile", userPersonalDetails);
      setUser(res.data.user);
      setIsLoading(false);
      setMessageInfo("Details updated successfully!", false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setMessageInfo("Unable to update changes!", true);
    }
  };

  //Discard Changes
  const discardChanges = (e) => {
    e.preventDefault();
    setUserPersonalDetails({
      firstname: user.fullname.firstname,
      lastname: user.fullname.lastname,
      email: user.email,
      DOB: user.DOB,
      phone: user.phone,
      address: user.address,
      about: user.about,
    });
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {/* Profile Photo Section  */}
      <section className="profile-section items-center h-[6rem] mt-4">
        {/* Profile Photo  */}
        <div className="flex">
          {user.profileImg?.url ? (
            <button onClick={() => setShowPhoto(true)}>
              <img
                src={user.profileImg?.url}
                className="h-[4.5rem] rounded-full aspect-square object-cover cursor-pointer"
                alt={user.profileImg?.filename}
                loading="lazy"
              />
            </button>
          ) : (
            <span className="flex items-center justify-center h-14 aspect-square rounded-full border-2  ">
              <PersonIcon sx={{ fontSize: "2rem" }} />
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-2xl">
            {user.fullname.firstname + " " + user.fullname.lastname}
          </h3>
          <p className="text-sm">{user.email}</p>
        </div>

        {user.profileImg?.url ? (
          ""
        ) : (
          <div className="ml-auto ">
            <label htmlFor="profileImg" className="cursor-pointer">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              id="profileImg"
              className="hidden"
              onChange={(e) => profileImgUpload(e)}
            />
          </div>
        )}
        {/* Edit Profile Picture  */}
        <div
          className={
            "flex justify-center items-center h-screen w-full bg-black/50 absolute top-0 left-0 z-30 transform" +
            (showPhoto ? " scale-100" : " scale-0")
          }
        >
          <div className={`relative`}>
            <img
              src={user.profileImg?.url}
              alt={user.profileImg?.filename}
              className="h-[25rem]  aspect-auto "
              loading="lazy"
            />
            <button
              className="cursor-pointer absolute top-2 right-2 bg-white/60 dark:bg-black/60 rounded-full p-2 text-sm hover:bg-white dark:hover:bg-black"
              onClick={() => setShowPhoto(false)}
            >
              <CloseIcon />
            </button>
            <span className="absolute bottom-2 left-2">
              <button className="cursor-pointer mr-4 bg-white/60 dark:bg-black/60 rounded-full p-2 px-4 text-sm hover:bg-white dark:hover:bg-black">
                <label htmlFor="profileImg">Change</label>
                <input
                  type="file"
                  id="profileImg"
                  accept="image/*"
                  className="hidden"
                  name="profileImg"
                  onChange={(e) => profileImgUpload(e)}
                />
              </button>
              <button
                className="cursor-pointer px-4 bg-white/60  dark:bg-black/60 rounded-full p-2  text-sm hover:bg-white dark:hover:bg-black"
                onClick={(e) => deleteProfileImg(e)}
              >
                Delete
              </button>
            </span>
          </div>
        </div>
      </section>
      {/* Details */}
      <section className="profile-section flex-col justify-center px-4 py-8 h-max-fit mt-2 mb-6">
        <h2 className="text-2xl font-semibold">Change profile details</h2>
        {/*Details Edit Form  */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => updateChanges(e)}
        >
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label htmlFor="firstname" className="font-semibold text-sm">
              Firstname*
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={userPersonalDetails.firstname}
              placeholder="Enter the firstname..."
              className="profile-input"
              onChange={handleInputChange}
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
              value={userPersonalDetails.lastname}
              placeholder="Enter the lastname..."
              className="profile-input"
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
              value={userPersonalDetails.email}
              className="profile-input"
              onChange={handleInputChange}
              placeholder="Enter the email..."
            />
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label htmlFor="dob" className="font-semibold text-sm">
              DOB
            </label>
            <input
              type="date"
              name="DOB"
              id="dob"
              value={userPersonalDetails.DOB}
              className="profile-input"
              onChange={handleInputChange}
              max={getMaxDob()}
            />
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label htmlFor="address" className="font-semibold text-sm">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={userPersonalDetails.address}
              className="profile-input"
              onChange={handleInputChange}
              placeholder="Enter your full address..."
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
              value={userPersonalDetails.phone}
              className="profile-input"
              onChange={handleInputChange}
              placeholder="Enter your contact number with country code..."
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label htmlFor="about" className="font-semibold text-sm">
              About
            </label>
            <textarea
              name="about"
              id="about"
              value={userPersonalDetails.about}
              className="profile-input"
              onChange={handleInputChange}
              rows={5}
              placeholder="Write somethign about yourself..."
            />
          </div>
          <div className="flex gap-1 col-span-2 ">
            <button
              className="cursor-pointer font-semibold px-6 py-2 hover:bg-[#e9ecef] dark:hover:bg-[#343a40] rounded-sm text-sm"
              type="submit"
              style={{ transition: "background-color 0.2ms linear" }}
            >
              Save
            </button>{" "}
            <button
              className="cursor-pointer font-semibold px-6 py-2 hover:bg-[#e9ecef] dark:hover:bg-[#343a40] rounded-sm text-sm"
              style={{ transition: "background-color 0.2ms linear" }}
              onClick={discardChanges}
            >
              Discard
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
