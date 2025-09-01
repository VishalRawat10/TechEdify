import { useContext, useEffect, useState } from "react";

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
    const getCourses = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get("/courses/home-page");
        setCourses(res.data.courses);

        const tutorsRes = await apiInstance.get("/tutors/home-page");
        setTutors(tutorsRes.data.tutors);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setMessageInfo(err.response.data.message || "Couldn't fetch courses!");
      }
    };
    getCourses();
  }, []);
  return (
    <>
      <main>
        {isLoading && <Loader />}
        {/* hero-section  */}
        <section className="px-4 py-4 md:px-[7rem] bg-[url('/images/section1-bg.jpg')] md:h-[85vh] bg-no-repeat bg-cover w-screen flex flex-col-reverse sm:px-12 md:flex-row items-center justify-between gap-4 text-dark-primary">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-semibold my-4">
              Learn. Code. Grow. Welcome to TechEdify.
            </h1>
            <p className="text-dark-secondary text-sm italic">
              Join thousands of learners mastering coding, data, and tech skills
              with real-world projects, expert instructors, and flexible
              learning paths—all in one platform.
            </p>
            <GetStartedBtn className="mt-4 md:mt-8" />
          </div>

          <img
            src="/images/hero-img.png"
            alt="hero"
            loading="lazy"
            className="h-66 md:h-[80%]"
          />
        </section>

        {/* our courses section  */}
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-8 bg-light dark:bg-dark-card">
          <p className="text-3xl md:text-5xl font-semibold">Our Courses</p>
          <div className="flex flex-col justify-center items-center sm:flex-row gap-8">
            {courses.map((course, idx) => {
              return <HomeCourseCard course={course} key={idx} />;
            })}
          </div>
        </section>

        {/* our instructor section  */}
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-8 md:gap-16 bg-light-card dark:bg-dark w-full">
          <p className="text-3xl md:text-5xl font-semibold">Meet our tutors</p>
          <div className="flex flex-col md:flex-row md:justify-between w-full gap-8 overflow-auto">
            {tutors.map((tutor, idx) => {
              return <HomeTutorCard tutor={tutor} key={idx} />;
            })}
          </div>
        </section>
        {/* What we offer  */}
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-6 md:gap-16 bg-light dark:bg-dark-card">
          <p className="text-3xl md:text-5xl font-semibold">What we offer</p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-x-8 md:gap-y-6 justify-center ">
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
        {/* Get Started section  */}
        <section className="flex flex-wrap justify-between items-center px-4 md:px-[8rem] py-8 md:py-20 bg-light-card dark:bg-dark gap-4">
          <p className="text-lg md:text-2xl font- text-main">
            Get started with <i>TechEdify</i> to begin learning
          </p>{" "}
          <GetStartedBtn />
        </section>
      </main>
    </>
  );
}
