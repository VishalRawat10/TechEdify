import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  return (
    <>
      <section className="bg-[url('/images/section1-bg.jpg')] h-[70vh] bg-no-repeat bg-cover w-screen">
        <h1></h1>
      </section>
    </>
  );
}
