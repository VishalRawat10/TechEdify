import { useState, useContext } from "react";
import { apiInstance } from "../../services/axios.config";
import { TutorContext } from "../../context/TutorContext";
import Avatar from "@mui/material/Avatar";
import { CircularProgress } from "@mui/material";
import { MessageContext } from "../../context/MessageContext";

export default function TutorProfile() {
  const { tutor, setTutor, setIsLoading, isLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);

  const [formData, setFormData] = useState({
    fullname: tutor?.fullname || "",
    email: tutor?.email || "",
    personalEmail: tutor?.personalEmail || "",
    contact: tutor?.contact || "",
    message: tutor?.message || "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("personalEmail", formData.personalEmail);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("message", formData.message);
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const res = await apiInstance.put("/tutor/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTutor(res.data.tutor);
      setMessageInfo("Profile updated successfully!", false);
    } catch (err) {
      console.error(err);
      setMessageInfo(err.response?.data?.message || "Profile update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      await apiInstance.put("/tutor/profile/change-password", passwordData);
      setMessageInfo("Password updated successfully!", false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      setMessageInfo(err.response?.data?.message || "Password update failed.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 py-6 px-4 sm:px-8 border-b border-gray-300 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Tutor Profile</h2>

      {/* PROFILE UPDATE FORM */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-light-card dark:bg-dark-card rounded-xl shadow p-6 mb-10"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <Avatar
            src={
              formData.profileImage
                ? URL.createObjectURL(formData.profileImage)
                : tutor?.profileImage?.url || "/images/default-avatar.png"
            }
            alt="Tutor Avatar"
            sx={{ width: 100, height: 100 }}
          />
          <div>
            <label className="block text-sm font-medium mb-2">
              Change Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Personal Email
            </label>
            <input
              type="email"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* NEW MESSAGE FIELD */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Message to Students
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Write a message or announcement for your students..."
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent resize-none"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-main text-white rounded-full hover:bg-main/90 transition disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? <CircularProgress size={20} /> : "Update Profile"}
          </button>
        </div>
      </form>

      {/* PASSWORD CHANGE FORM */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-light-card dark:bg-dark-card rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData((p) => ({
                  ...p,
                  oldPassword: e.target.value,
                }))
              }
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((p) => ({
                  ...p,
                  newPassword: e.target.value,
                }))
              }
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-2 bg-main text-white rounded-full hover:bg-main/90 transition disabled:opacity-60 cursor-pointer"
          >
            {isChangingPassword ? (
              <CircularProgress size={20} />
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
