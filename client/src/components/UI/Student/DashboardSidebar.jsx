import BecomeInstructorBtn from "./BecomeInstructorBtn";
import DbSideItem from "../DbSideItem";

export default function DashboardSidebar() {
  const sideBarItems = [
    {
      img: "/svg/DashboardHome.svg",
      title: "Dashboard Overview",
      to: "/user/dashboard",
    },
    {
      img: "/svg/DashboardCourses.svg",
      title: "My Courses",
      to: "/user/dashboard/#my-courses",
    },
    {
      img: "/svg/DashboardAssignment.svg",
      title: "Assignments",
      to: "/user/dashboard/#assignments",
    },
    {
      img: "/svg/DashboardMessage.svg",
      title: "Discussions",
      to: "/user/dashboard/#discussions",
    },
  ];

  return (
    <div className="min-w-fit lg:w-[17rem] bg-[var(--base)] h-[calc(100vh-var(--header-h)-2rem)] rounded-xl py-8 flex flex-col gap-y-4">
      {sideBarItems.map((item, idx) => (
        <DbSideItem img={item.img} title={item.title} to={item.to} key={idx} />
      ))}
      <BecomeInstructorBtn className="hidden lg:block" />
    </div>
  );
}
