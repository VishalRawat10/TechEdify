import { useState, useContext } from "react";
import { apiInstance } from "../../services/axios.config";
import { TutorContext } from "../../context/TutorContext";
import { MessageContext } from "../../context/MessageContext";
import Avatar from "@mui/material/Avatar";
import { CircularProgress } from "@mui/material";
import {
  FormInput,
  FormTextarea,
  FormButton,
} from "../../components/FormComponents";

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
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Input change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, profileImage: e.target.files[0] }));
  };

  // === UPDATE PROFILE ===
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) formDataToSend.append(key, formData[key]);
      });

      const res = await apiInstance.put("/tutors/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTutor(res.data.tutor);
      setMessageInfo("Profile updated successfully!", false);
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Profile update failed.",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // === CHANGE PASSWORD ===
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessageInfo("New password and confirm password do not match!", true);
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiInstance.put("/tutors/profile/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setMessageInfo("Password updated successfully!", false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Password update failed.",
        true
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="overflow-auto scrollbar-thin scrollbar-thumb-gray-500 py-6 px-4 sm:px-8 border-b border-gray-300 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Tutor Profile</h2>

      {/* === PROFILE FORM === */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-light-card dark:bg-dark-card rounded-xl shadow p-6 mb-10"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <Avatar
            src={
              formData.profileImage
                ? URL.createObjectURL(formData.profileImage)
                : tutor?.profileImage?.url || "/images/User.png"
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
          <FormInput
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name..."
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            disabled
          />
          <FormInput
            label="Personal Email"
            name="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={handleChange}
            placeholder="Enter your personal email..."
          />
          <FormInput
            label="Contact"
            name="contact"
            type="tel"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter your contact number..."
          />
        </div>

        <div className="mt-6">
          <FormTextarea
            label="Message to Students"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write a message or announcement for your students..."
            rows={5}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <FormButton type="button" onClick={() => setFormData({ ...tutor })}>
            Cancel
          </FormButton>
          <FormButton type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : "Update Profile"}
          </FormButton>
        </div>
      </form>

      {/* === PASSWORD FORM === */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-light-card dark:bg-dark-card rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="grid sm:grid-cols-3 gap-5">
          <FormInput
            label="Old Password"
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, oldPassword: e.target.value }))
            }
            placeholder="Enter your current password..."
            required
          />
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
            }
            placeholder="Enter new password..."
            required
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((p) => ({
                ...p,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Re-enter new password..."
            required
          />
        </div>

        <div className="mt-6 flex justify-end">
          <FormButton type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? (
              <CircularProgress size={20} />
            ) : (
              "Change Password"
            )}
          </FormButton>
        </div>
      </form>
    </section>
  );
}
