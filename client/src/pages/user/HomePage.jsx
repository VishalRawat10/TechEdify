import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetStartedBtn from "../../components/ui/GetStartedBtn";
import HomeCourseCard from "../../components/ui/HomeCourseCard";
import HomeTutorCard from "../../components/ui/HomeTutorCard";
import { HomeOurOffer } from "../../components/ui/HomeOurOffer";
import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import Loader from "../../components/Loader";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setMessageInfo } = useContext(MessageContext);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [courseRes, tutorRes] = await Promise.all([
          apiInstance.get("/courses/home-page"),
          apiInstance.get("/tutors/home-page"),
        ]);
        setCourses(courseRes.data.courses || []);
        setTutors(tutorRes.data.tutors || []);
      } catch (err) {
        setMessageInfo(err.response?.data?.message || "Couldn't fetch data!");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-light dark:bg-dark transition-colors duration-300">
      {isLoading && <Loader />}

      {/* Hero Section */}
      <section className="px-4 py-8 md:px-20 md:py-20 bg-[url('/images/section1-bg.jpg')] bg-cover bg-no-repeat flex flex-col-reverse md:flex-row items-center justify-between gap-6 text-dark-primary">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn. Code. Grow. <br /> Welcome to{" "}
            <span className="text-main">TechEdify</span>.
          </h1>
          <p className="text-dark-secondary text-base italic leading-relaxed">
            Join thousands of learners mastering coding, data, and tech skills
            with real-world projects, expert instructors, and flexible learning
            paths—all in one platform.
          </p>
          <GetStartedBtn className="mt-6" />
        </div>

        <img
          src="/images/hero-img.png"
          alt="hero"
          loading="lazy"
          className="h-60 md:h-[75%]"
        />
      </section>

      {/* Courses Section */}
      <section className="px-4 md:px-20 py-16 flex flex-col items-center gap-10 bg-light dark:bg-dark-card transition-colors duration-300">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Our <span className="text-main">Courses</span>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl">
          Explore our diverse collection of tech courses designed to help you
          master in-demand skills and accelerate your career.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full mt-6">
          {courses.length > 0 ? (
            courses.map((course, idx) => (
              <HomeCourseCard course={course} key={idx} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
              No courses available at the moment.
            </p>
          )}
        </div>

        <Link
          to="/courses"
          className="px-6 py-3 mt-6 text-white bg-main hover:bg-main/90 rounded-full font-medium shadow-md transition-colors duration-200"
        >
          View All Courses
        </Link>
      </section>

      {/* Tutors Section */}
      <section className="px-4 md:px-20 py-16 flex flex-col items-center gap-10 bg-light-card dark:bg-dark transition-colors duration-300">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Meet Our <span className="text-main">Tutors</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full mt-6">
          {tutors.length > 0 ? (
            tutors.map((tutor, idx) => (
              <HomeTutorCard tutor={tutor} key={idx} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
              No tutors found at the moment.
            </p>
          )}
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="px-4 md:px-20 py-16 flex flex-col items-center gap-10 bg-light dark:bg-dark-card transition-colors duration-300">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          What <span className="text-main">We Offer</span>
        </h2>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-8 justify-center mt-4">
          <HomeOurOffer
            img="/images/tutor.png"
            heading="Expert-Led IT & Coding Courses"
            description="Learn from industry professionals with real-world experience in web development, data structures, programming, cybersecurity, and more."
          />
          <HomeOurOffer
            img="/images/project.png"
            heading="Hands-On Learning with Projects"
            description="Build practical skills through interactive coding exercises and real-life projects designed to boost your confidence and portfolio."
          />
          <HomeOurOffer
            img="/images/books.png"
            heading="Access to Downloadable Resources"
            description="Get curated PDFs, coding references, and notes to support your learning anytime—even offline."
          />
          <HomeOurOffer
            img="/images/anytime-anywhere.png"
            heading="Anytime, Anywhere Learning"
            description="Enjoy seamless access across all devices—learn at your own pace, on your own schedule."
          />
          <HomeOurOffer
            img="/images/message.png"
            heading="Community & Peer Support"
            description="Join forums, ask questions, share knowledge, and grow together with other coding enthusiasts and mentors."
          />
        </div>
      </section>

      {/* Get Started Section */}
      <section className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20 py-12 bg-light-card dark:bg-dark gap-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-lg md:text-2xl font-medium text-main text-center md:text-left">
          Get started with <i>TechEdify</i> today and start your learning
          journey!
        </p>
        <GetStartedBtn />
      </section>
    </main>
  );
}
