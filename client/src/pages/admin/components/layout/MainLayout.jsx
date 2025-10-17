import Sidebar from "../Sidebar";
import DrawerSidebar from "./DrawerSidebar";
import Header from "../Header";
import { useState } from "react";
import Message from "../../../../components/Message";
import Loader from "../../../../components/Loader";

export default function MainLayout({ isLoading, setIsLoading, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-light dark:bg-dark text-light-primary dark:text-dark-primary">
      <Message />
      {isLoading && <Loader />}
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 fixed left-0 top-0 h-full shadow-md z-30">
        <Sidebar setIsLoading={setIsLoading} />
      </aside>

      {/* Drawer (mobile) */}
      <DrawerSidebar
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setIsLoading={setIsLoading}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col relative">
        <Header onMenuClick={() => setIsDrawerOpen(true)} />
        <div className="px-6 lg:pt-0 pt-[80px]">{children}</div>
      </main>
    </div>
  );
}
