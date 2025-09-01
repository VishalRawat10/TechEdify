import { useContext, useRef, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import KeyIcon from "@mui/icons-material/Key";

import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";
import {
  userDetailsFormValidation,
  passwordFormValidation,
} from "../../services/utils";
import { FormButton, FormInput } from "../../components/FormComponents";
export default function UserProfilePage() {
  const {
    user,
    updateProfileImage,
    deleteProfileImage,
    updateProfile,
    updatePassword,
  } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const profileImageRef = useRef(null);

  const [showProfileImage, setShowProfileImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(user);
  const [userDetailsErrors, setUserDetailsErrors] = useState({
    isError: false,
  });
  const [passwords, setPasswords] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    isError: false,
  });

  useEffect(() => {
    setUserDetailsErrors(userDetailsFormValidation(userDetails));
  }, [userDetails]);

  useEffect(() => {
    setPasswordErrors(passwordFormValidation(passwords));
  }, [passwords]);

  //Profile image upolad handler
  const handleProfileImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);
    try {
      setShowProfileImage(false);
      setIsLoading(true);
      const res = await updateProfileImage(formData);
      setMessageInfo(res.data.message, false);
      setIsLoading(false);
    } catch (err) {
      setMessageInfo(
        err.response.data.message || "Unable to upload the image!",
        true
      );
      setIsLoading(false);
    }
  };

  // Remove image btn handler
  const removeProfileImage = async (e) => {
    try {
      setShowProfileImage(false);
      setIsLoading(true);
      const res = await deleteProfileImage();
      setIsLoading(false);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      setIsLoading(false);
      setMessageInfo(
        err.response.data.message || "Couldn't remove profile image!"
      );
    }
  };

  const handleUserDetailsChange = (e) => {
    e.preventDefault();
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordsChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  //Save profile details
  const saveProfileHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await updateProfile(userDetails);
      setIsLoading(false);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      setIsLoading(false);
      setMessageInfo(err.response.data.message, true);
    }
  };

  //Change password
  const submitChangePassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await updatePassword(passwords);
      setIsLoading(false);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      setIsLoading(false);
      setMessageInfo(err.response.data.message);
    }
  };

  const disardChanges = (e) => {
    e.preventDefault();
    setUserDetails(user);
  };

  return (
    <>
      {isLoading && <Loader />}
      {/* Profile Details =================================================================================== */}
      <section className=" flex flex-col items-center gap-4 bg-light-card dark:bg-dark-card p-4 rounded-xl h-fit shadow-md md:flex-row">
        {/* Profile image update ====================  */}
        <button
          className="h-fit w-fit flex flex-col gap-2 items-center justify-center cursor-pointer relative hover:opacity-70"
          onClick={() =>
            user?.profileImage?.url
              ? setShowProfileImage(true)
              : profileImageRef.current.click()
          }
        >
          <img
            src={user?.profileImage?.url || "/images/User.png"}
            alt=""
            className="w-[7rem] aspect-square rounded-full object-cover contrast-125"
            loading="lazy"
          />
          <span
            className={`z-10 text-black font-semibold
             absolute top-[48%] text-[11px] ${
               user?.profileImage?.url && "hidden"
             }`}
          >
            Click to upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              name="profileImage"
              ref={profileImageRef}
              onChange={(e) => {
                if (e.target.files.length) {
                  return handleProfileImageUpload(e);
                }
              }}
            />
          </span>
        </button>

        {/* Show profile image ===========================================*/}
        <div
          className={`fixed flex bg-black/30 items-center justify-center top-0 left-0 right-0 bottom-0 z-30 ${
            !showProfileImage && "hidden"
          }`}
        >
          <div className="relative w-fit h-fit ">
            <img
              src={user?.profileImage?.url || "/images/User.png"}
              alt=""
              className="h-[20rem]"
              title="Profile Image"
              loading="lazy"
            />
            <button
              className="text-light cursor-pointer absolute top-2 right-2 p-1 rounded-full aspect-square bg-black/60  hover:bg-black/70"
              onClick={() => setShowProfileImage(false)}
            >
              <CloseIcon />
            </button>
            <div className="flex gap-2 absolute bottom-3 left-2 text-white">
              <button
                className="py-1 px-3 text-[13px] cursor-pointer bg-black/60  hover:bg-black/70 rounded-full"
                onClick={() => profileImageRef.current.click()}
              >
                Upload
              </button>
              <button
                className="py-1 px-3 text-[13px] cursor-pointer bg-black/60  hover:bg-black/70 rounded-full"
                onClick={removeProfileImage}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* User login details  */}
        <div className="text-sm">
          <h3 className=" text-xl md:text-2xl">{user?.fullname}</h3>
          <p className="text-sm ">{user?.email}</p>
          <p className="capitalize">
            <strong>LoggedIn Device: </strong>
            {user?.currDevice}
          </p>
          <p>
            <strong>Login Time: </strong>
            {new Date(user?.currLoginTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })}
          </p>
        </div>
      </section>

      {/* Edit profile detaiils ================================================================================ */}
      <section className="flex flex-col px-2 gap-4">
        <h3 className="text-xl md:text-2xl flex gap-2 items-center text-main">
          <EditIcon fontSize="small" />
          Edit Profile Details
        </h3>
        <form
          className="grid grid-cols-2 gap-x-8 gap-y-8"
          onSubmit={saveProfileHandler}
        >
          <FormInput
            id="fullname"
            name="fullname"
            type="text"
            label="Fullname"
            value={userDetails.fullname}
            placeholder="Write your fullname..."
            required={true}
            errMsg={userDetailsErrors.fullname}
            onChange={handleUserDetailsChange}
          />
          <FormInput
            id="email"
            name="email"
            value={userDetails.email}
            type="email"
            label="Email"
            placeholder="Enter your email..."
            onChange={handleUserDetailsChange}
            errMsg={userDetailsErrors.email}
            required={true}
          />
          <FormInput
            id="phone"
            value={userDetails.phone}
            name="phone"
            type="tel"
            label="Phone"
            errMsg={userDetailsErrors.phone}
            onChange={handleUserDetailsChange}
            placeholder="Enter your phone number..."
          />
          <FormInput
            id="address"
            value={userDetails.address}
            name="address"
            type="address"
            label="address"
            onChange={handleUserDetailsChange}
            placeholder="Enter your address..."
          />
          <FormInput
            id="country"
            name="country"
            value={userDetails.country}
            type="country"
            label="Country"
            onChange={handleUserDetailsChange}
            placeholder="Enter your country name..."
          />
          <FormInput
            id="dob"
            name="DOB"
            type="date"
            label="Date of Birth"
            onChange={handleUserDetailsChange}
            value={new Date(userDetails.DOB).toISOString().slice(0, 10)}
          />
          <div className="flex flex-col col-span-2">
            <label htmlFor="about" className="capitalize">
              About*
            </label>
            <textarea
              id="about"
              className={
                "border-1 w-full focus:outline-none focus:ring-2 rounded-lg p-2 text-sm " +
                (userDetailsErrors.about
                  ? " border-red-600 focus:ring-red-600/30 dark:border-red-500 focus:dark:ring-red-400/30"
                  : "border-gray-600 dark:border-gray-300 focus:border-black focus:dark:border-white focus:ring-main/50")
              }
              required={true}
              placeholder="Write about yourself..."
              rows={5}
              value={userDetails.about}
              onChange={handleUserDetailsChange}
              name="about"
            ></textarea>
            {userDetailsErrors.about && (
              <p className="text-[13px] text-red-600">
                {userDetailsErrors.about}
              </p>
            )}
          </div>

          {/* btns  */}
          <div className="flex gap-4 text-dark-primary dark:text-light-primary mt-4 text-sm">
            <button
              className="bg-black dark:bg-white px-6 py-2 rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={userDetailsErrors.isError}
            >
              Save
            </button>
            <button
              className="bg-black dark:bg-white px-6 py-2 rounded-full cursor-pointer"
              onClick={() => setUserDetails(user)}
            >
              Discard
            </button>
          </div>
        </form>
      </section>

      {/* Update password ======================================================================================= */}
      <section className="flex flex-col px-2 gap-4 py-2 border-t-1 dark:border-t-gray-300/20 border-t-gray-400">
        <h3 className="text-xl md:text-2xl flex gap-2 items-center text-main">
          <KeyIcon fontSize="small" />
          Create new password
        </h3>
        <form
          className="grid grid-cols-2 gap-8"
          onSubmit={submitChangePassword}
        >
          <div className="col-span-2 md:w-1/2">
            <FormInput
              id="current-password"
              name="currentPassword"
              type="text"
              label="Current password"
              placeholder="Enter the current password..."
              required={true}
              errMsg={passwordErrors.currentPassword}
              onChange={handlePasswordsChange}
            />
          </div>

          <FormInput
            id="new-password"
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="Enter the new password..."
            required={true}
            onChange={handlePasswordsChange}
            errMsg={passwordErrors.newPassword}
          />
          <FormInput
            id="confirm-password"
            name="confirmPassword"
            type="text"
            label="Confirm password"
            placeholder="Confirm your password..."
            required={true}
            onChange={handlePasswordsChange}
            errMsg={passwordErrors.confirmPassword}
          />
          <div className="text-sm col-span-2">
            <p>
              <strong>Note: </strong>New password must contain :
            </p>
            <ul className="px-8 list-item list-disc">
              <li>Minimum 8 characters.</li>
              <li>At least one uppercase letter([A - Z]).</li>
              <li>At least one lowercase letter([a - z]).</li>
              <li>At least one digit([0 - 9]).</li>
              <li>At least one special character([# ? !@$ %^&* -]).</li>
            </ul>
          </div>
          <div className="flex gap-4 text-dark-primary dark:text-light-primary mt-4 text-sm">
            <FormButton type="submit" disabled={passwordErrors.isError}>
              Update
            </FormButton>
            <FormButton onClick={disardChanges}>Discard</FormButton>
          </div>
        </form>
      </section>
    </>
  );
}
