import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  return <p className="dark:text-white">{user?.email}</p>;
}
