import React, { useContext, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";

import { UserContext } from "../context/UserContext";
import { apiInstance } from "../services/axios.config";
import { MessageContext } from "../context/MessageContext";

export default function ContactUs() {
  const { user } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const fullname = user
    ? user?.fullname?.firstname + " " + user?.fullname?.lastname
    : "";
  const [messageDetails, setMessageDetails] = useState({
    fullname: fullname,
    email: user?.email,
    message: "",
  });

  //Input Change
  const handleInputChange = (e) => {
    setMessageDetails({
      ...messageDetails,
      [e.target.name]: e.target.value,
    });
  };

  //Send Message
  const msgFormSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await apiInstance.post("/message", messageDetails);
      console.log(res);
      setMessageInfo("Message sent!", false);
      setMessageDetails({ ...messageDetails, message: "" });
    } catch (err) {
      console.log(err);
      setMessageInfo("Couldn't send message!", true);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mt-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Contact Us
        </h1>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-4">
            <LocationOnIcon className="text-blue-600" />
            <div>
              <h4 className="font-semibold">Our Office</h4>
              <p>Dehradun, Uttarakhand, India</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <PhoneIcon className="text-blue-600" />
            <div>
              <h4 className="font-semibold">Call Us</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <EmailIcon className="text-blue-600" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p>support@techedify.com</p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={(e) => msgFormSubmitHandler(e)}
        >
          <div className="col-span-2 md:col-span-1 flex flex-col">
            <label htmlFor="fullname" className="mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={messageDetails.fullname}
              minLength={2}
              name="fullname"
              placeholder="Enter your full name"
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={messageDetails.email}
              name="email"
              placeholder="example@email.com"
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-2 flex flex-col">
            <label htmlFor="message" className="mb-1 font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={messageDetails.message}
              rows="5"
              minLength={10}
              placeholder="Your message here..."
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10 text-blue-600">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon
              fontSize="large"
              className="hover:text-blue-800 transition"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon
              fontSize="large"
              className="hover:text-pink-600 transition"
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon
              fontSize="large"
              className="hover:text-blue-700 transition"
            />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon
              fontSize="large"
              className="hover:text-sky-500 transition"
            />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon
              fontSize="large"
              className="hover:text-black transition"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
