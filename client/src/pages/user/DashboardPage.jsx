import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";
import {
  FormButton,
  FormInput,
  FormTextarea,
} from "../../components/FormComponents";
import Loader from "../../components/Loader";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import { getDateAndTime } from "../../services/utils";

export default function UserDashboard() {
  const { setMessageInfo } = useContext(MessageContext);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Password Change State
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, transRes] = await Promise.all([
          apiInstance.get("/users/enrolled-courses"),
          apiInstance.get("/users/payments"),
        ]);
        setCourses(coursesRes.data.courses);
        setTransactions(transRes.data.transactions);
      } catch (err) {
        setMessageInfo(
          err.response?.data?.message || "Failed to load data",
          true
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Input Change Handler
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Profile Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  // Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();
      Object.keys(updatedUser).forEach((key) =>
        formData.append(key, updatedUser[key])
      );
      if (profileImage) formData.append("profileImage", profileImage);

      const res = await apiInstance.put("/users/profile", formData);
      setUser(res.data.user);
      setMessageInfo("Your profile is updated successfully!", false);
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Failed to update profile!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Password Update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessageInfo("Passwords do not match!", true);
      return;
    }
    setIsLoading(true);

    try {
      const res = await apiInstance.patch(
        "/users/profile/change-password",
        passwords
      );
      setMessageInfo(
        res.data.message || "Password updated successfully!",
        false
      );
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessageInfo(
        err.response?.data?.message || "Failed to change password!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-10 md:px-20 py-10 dark:text-white text-black bg-light-bg dark:bg-dark-bg min-h-screen">
      {isLoading && <Loader />}
      {/* === PROFILE SECTION === */}
      <section className="bg-light-card dark:bg-dark-subcard p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="relative w-32 h-32 mx-auto md:mx-0">
            <img
              src={
                profilePreview || user?.profileImage?.url || "/images/User.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-main shadow-md"
            />
            {isEditing && (
              <>
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-main text-white rounded-full p-2 cursor-pointer hover:bg-main/80 transition"
                >
                  <EditIcon fontSize="small" />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold">{user.fullname}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-2 text-sm sm:text-base">
            <p>
              <strong>Contact:</strong> {user.contact || "Not provided"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "Not provided"}
            </p>
            <p>
              <strong>DOB:</strong>
              {user.DOB ? new Date(user.DOB).toDateString() : "Not set"}
            </p>
            <p>
              <strong>Country:</strong> {user.country || "Not specified"}
            </p>
            <p>
              <strong>About:</strong> {user.about || "No description added."}
            </p>

            <FormButton
              className="mt-4 w-fit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </FormButton>
          </div>
        ) : (
          <form
            onSubmit={handleProfileUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <FormInput
              label="Full Name"
              name="fullname"
              value={updatedUser.fullname || ""}
              onChange={handleChange}
              placeholder="Enter your fullname..."
              required={true}
            />
            <FormInput
              label="Email"
              name="email"
              value={updatedUser.email || ""}
              onChange={handleChange}
              placeholder="Write your email..."
              required={true}
            />
            <FormInput
              label="Contact"
              name="contact"
              value={updatedUser.contact || ""}
              onChange={handleChange}
              placeholder="Enter your contact..."
            />
            <FormInput
              label="Address"
              name="address"
              value={updatedUser.address || ""}
              onChange={handleChange}
              placeholder="Enter your address..."
            />
            <FormInput
              label="Date of Birth"
              type="date"
              name="DOB"
              value={updatedUser.DOB?.split("T")[0] || ""}
              onChange={handleChange}
            />
            <FormInput
              label="Country"
              name="country"
              value={updatedUser.country || ""}
              onChange={handleChange}
              className="capitalize"
              placeholder="Enter your country..."
            />
            <div className="col-span-2">
              <FormTextarea
                label="About"
                name="about"
                value={updatedUser.about}
                rows={3}
                onChange={handleChange}
                placeholder="Write about yourself..."
                required={true}
              />
            </div>
            <div className="col-span-2 flex flex-wrap justify-start gap-4 w-full mt-3">
              <FormButton type="submit" className="w-fit">
                Save
              </FormButton>
              <FormButton onClick={() => setIsEditing(false)} className="w-fit">
                Cancel
              </FormButton>
            </div>
          </form>
        )}
      </section>

      {/* === CHANGE PASSWORD SECTION === */}
      <section className="bg-light-card dark:bg-dark-subcard p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <LockResetIcon />
          <h2 className="text-2xl font-semibold">Change Password</h2>
        </div>
        <form
          onSubmit={handlePasswordChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <FormInput
            label="Old Password"
            name="oldPassword"
            type="password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            placeholder="Enter current password..."
            disabled={isLoading}
            required
          />
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            placeholder="Enter new password..."
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            disabled={isLoading}
            required
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            placeholder="Confirm new password..."
            disabled={isLoading}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            required
          />
          <FormButton
            type="submit"
            className="md:col-span-3 w-fit"
            disabled={isEditing || isLoading}
          >
            Update Password
          </FormButton>
        </form>
      </section>

      {/* === MY COURSES SECTION === */}
      <section className="bg-light-card dark:bg-dark-subcard p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
        {courses.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course._id}
                className="rounded-xl overflow-hidden shadow-md bg-light-subcard dark:bg-dark-card"
                to={`/courses/${course._id}/learn`}
              >
                <img
                  src={course.thumbnail?.url}
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {course.alias}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No courses enrolled yet.</p>
        )}
      </section>

      {/* === TRANSACTION HISTORY === */}
      <section className="bg-light-card dark:bg-dark-subcard p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {transactions.length ? (
          <div className="overflow-auto scrollbar-thin">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="border-t border-gray-300 dark:border-gray-600"
                  >
                    <td className="p-2">{txn.courseId?.title || "N/A"}</td>
                    <td className="p-2">₹{txn.amount}</td>
                    <td className="p-2">
                      {getDateAndTime(txn.createdAt, true)}
                    </td>
                    <td className="p-2">{txn.transactionId || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
      </section>
    </div>
  );
}
