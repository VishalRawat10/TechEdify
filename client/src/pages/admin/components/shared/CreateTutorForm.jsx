import { useState, useContext } from "react";
import { apiInstance } from "../../../../services/axios.config";
import { Modal, Box, CircularProgress } from "@mui/material";

import { MessageContext } from "../../../../context/MessageContext";
import {
  FormInput,
  FormTextarea,
  FormButton,
} from "../../../../components/FormComponents";

export default function CreateTutorForm({
  open,
  onClose,
  onTutorCreated,
  setIsLoading,
}) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    personalEmail: "",
    password: "",
    message: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  const { setMessageInfo } = useContext(MessageContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const res = await apiInstance.post("/admin/tutors", data);
      onTutorCreated(res.data.tutor);
      onClose();
      setFormData({
        fullname: "",
        email: "",
        personalEmail: "",
        password: "",
        message: "",
      });
      setPreview(null);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      console.error("Error creating tutor:", err);
      setMessageInfo(err.response?.data?.message || "Failed to create tutor.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 bg-white dark:bg-dark-card p-6 rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
        <h3 className="text-xl font-semibold mb-4">Create New Tutor</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            label="Fullname"
            name="fullname"
            placeholder="Enter tutor fullname..."
            onChange={handleChange}
            type="text"
            required={true}
            minLength={2}
          />
          <FormInput
            label="Company email"
            name="email"
            placeholder="Enter tutor's company email..."
            onChange={handleChange}
            type="email"
            required={true}
          />
          <FormInput
            label="Personal email"
            name="personalEmail"
            placeholder="Enter tutor's personal email..."
            onChange={handleChange}
            type="email"
            required={true}
          />
          <FormInput
            label="Contact"
            name="contact"
            placeholder="Enter tutor's contact number..."
            onChange={handleChange}
            type="tel"
            required={true}
          />
          <FormInput
            label="Password"
            name="password"
            placeholder="Enter the password ***"
            onChange={handleChange}
            type="text"
            required={true}
          />
          <FormTextarea
            label="Message for students"
            name="message"
            placeholder="eg. Keep learning keep growing..."
            onChange={handleChange}
            type="text"
            rows={3}
            required={true}
          />

          <div className="flex justify-end gap-3 mt-4">
            <FormButton onClick={onClose} disabled={loading}>
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="bg-main text-white"
            >
              {loading ? <CircularProgress size={20} /> : "Create"}
            </FormButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
