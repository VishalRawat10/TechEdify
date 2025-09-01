import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-light dark:bg-dark p-6">
      <div className="max-w-5xl mx-auto bg-light-card dark:bg-dark-card rounded-2xl shadow-md p-4 sm:p-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          About TechEdify
        </h1>

        {/* Intro */}
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto mb-10">
          TechEdify is a modern e-learning platform that bridges the gap between
          students and top-tier instructors. Whether you’re a beginner or a
          professional, we empower learners with the right tools, resources, and
          mentorship to excel in the tech world.
        </p>

        {/* Core Values / Highlights */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
          <div className="flex flex-col items-center text-center">
            <SchoolIcon fontSize="large" className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Quality Learning</h3>
            <p className="text-sm mt-2">
              Access high-quality, instructor-led courses tailored to real-world
              tech skills.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <GroupIcon fontSize="large" className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Community Driven</h3>
            <p className="text-sm mt-2">
              Collaborate and grow with a vibrant community of coders, creators,
              and learners.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <EmojiObjectsIcon fontSize="large" className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Innovation First</h3>
            <p className="text-sm mt-2">
              Learn the latest tech trends through interactive, project-based
              content.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 text-center">
            Our Mission
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300 text-base max-w-3xl mx-auto">
            Our mission is to make tech education accessible, engaging, and
            effective. We aim to create an inclusive learning environment where
            every student has the opportunity to become job-ready, build amazing
            things, and stay ahead in the ever-evolving tech space.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Ready to elevate your learning journey?
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
