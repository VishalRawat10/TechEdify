import { useContext } from "react";

import GetStartedBtn from "../../components/UI/GetStartedBtn";
import { CoursesContext } from "../../context/CoursesContext";
import HomeCourseCard from "../../components/UI/HomeCourseCard";
import { HoomeInstructorCard } from "../../components/UI/HomeInstructorCard";
import { HomeOurOffer } from "../../components/UI/HomeOurOffer";

export default function Home() {
  const { courses } = useContext(CoursesContext);
  return (
    <>
      <main>
        {/* hero-section  */}
        <section className="px-4 py-4 md:px-[7rem] bg-[url('/images/section1-bg.jpg')] md:h-[85vh] bg-no-repeat bg-cover w-screen flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-semibold my-4">
              Learn. Code. Grow. Welcome to TechEdify.
            </h1>
            <p className="opacity-75 text-sm italic">
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
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-8">
          <p className="text-3xl md:text-5xl font-semibold">Our courses</p>
          <div className="flex flex-col sm:flex-row gap-8">
            <HomeCourseCard course={courses ? courses[0] : ""} />
            <HomeCourseCard course={courses ? courses[1] : ""} />
            <HomeCourseCard course={courses ? courses[2] : ""} />
          </div>
        </section>

        {/* our instructor section  */}
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-8 md:gap-16 bg-white dark:bg-[var(--dark-bg-2)] w-full">
          <p className="text-3xl md:text-5xl font-semibold">
            Meet our instructors
          </p>
          <div className="flex flex-col md:flex-row md:justify-between w-full gap-8 overflow-auto">
            <HoomeInstructorCard />
            <HoomeInstructorCard />
            <HoomeInstructorCard />
          </div>
        </section>
        {/* What we offer  */}
        <section className="px-4 md:px-[8rem] py-8 md:py-20 flex flex-col items-center gap-6 md:gap-16">
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
        <section className="flex flex-wrap justify-between items-center px-4 md:px-[8rem] py-8 md:py-20 bg-white dark:bg-[var(--dark-bg-2)] gap-4">
          <p className="text-lg md:text-2xl font- text-[var(--base)]">
            Get started with <i>TechEdify</i> to begin learning
          </p>{" "}
          <GetStartedBtn />
        </section>
      </main>
    </>
  );
}
