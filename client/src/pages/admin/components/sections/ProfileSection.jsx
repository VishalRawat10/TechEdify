import { useState, useContext } from "react";
import { apiInstance } from "../../../../services/axios.config";
import { AdminContext } from "../../../../context/AdminContext";
import { MessageContext } from "../../../../context/MessageContext";
import { Edit, Save, CloudUpload, Lock } from "@mui/icons-material";

export default function ProfileSection({ setIsLoading }) {
  const { admin, setAdmin } = useContext(AdminContext);
  const { setMessageInfo } = useContext(MessageContext);

  // === STATES ===
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(admin?.profileImage?.url || "");
  const [formData, setFormData] = useState({
    fullname: admin?.fullname || "",
    email: admin?.email || "",
    personalEmail: admin?.personalEmail || "",
    profileImage: null,
  });

  // For password update
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // === HANDLERS ===

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
  };

  // Save Profile Details
  const handleSave = async () => {
    try {
      setLoading(true);
      setIsLoading(false);
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("personalEmail", formData.personalEmail);
      if (formData.profileImage)
        data.append("profileImage", formData.profileImage);

      const res = await apiInstance.put("/admin/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAdmin(res.data.admin);
      setIsEditing(false);
      setMessageInfo("Profile updated successfully!", false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessageInfo("Failed to update profile.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  //handle cancle
  const handleCancle = (e) => {
    setIsEditing(false);
    setFormData({
      fullname: admin?.fullname || "",
      email: admin?.email || "",
      personalEmail: admin?.personalEmail || "",
      profileImage: null,
    });
    setPreview(admin?.profileImage?.url || "");
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setUpdatingPassword(true);
      const res = await apiInstance.patch("/admin/profile/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setMessageInfo(
        res.data.message || "Password updated successfully!",
        false
      );
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error updating password:", err);
      setMessageInfo(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setUpdatingPassword(false);
      setIsLoading(false);
    }
  };

  // === RENDER ===
  return (
    <section id="profile" className="min-h-[100vh] py-6">
      <h3 className="text-2xl font-bold mb-6">Admin Profile</h3>

      <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-md max-w-2xl mx-auto space-y-10">
        {/* ---------- PROFILE INFO SECTION ---------- */}
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={preview || "/images/User.png"}
                alt="Admin Avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />
              {isEditing && (
                <>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-main text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition"
                  >
                    <CloudUpload fontSize="small" />
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-3 mt-3">
              <h4 className="font-semibold text-lg">{formData.fullname}</h4>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-main hover:underline text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Edit fontSize="small" /> Edit
                </button>
              )}
            </div>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Fullname */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border rounded-lg p-2 bg-transparent focus:outline-none ${
                  isEditing ? "border-main" : "border-gray-400"
                }`}
              />
            </div>

            {/* Official Email */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Email (Official)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border rounded-lg p-2 bg-transparent focus:outline-none ${
                  isEditing ? "border-main" : "border-gray-400"
                }`}
              />
            </div>

            {/* Personal Email */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border rounded-lg p-2 bg-transparent focus:outline-none ${
                  isEditing ? "border-main" : "border-gray-400"
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCancle}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1 bg-main text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                >
                  <Save fontSize="small" /> {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ---------- PASSWORD UPDATE SECTION ---------- */}
        <div className="border-t pt-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock fontSize="small" /> Change Password
          </h4>
          <form className="flex flex-col gap-4" onSubmit={handlePasswordChange}>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                required
                className="border rounded-lg p-2 bg-transparent border-gray-400 focus:border-main focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
                className="border rounded-lg p-2 bg-transparent border-gray-400 focus:border-main focus:outline-none"
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="flex items-center gap-1 bg-main text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
