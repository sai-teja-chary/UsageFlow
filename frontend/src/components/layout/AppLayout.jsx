import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";


export const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 fixed h-full bg-white">
        <Sidebar />
      </div>

      {/* Right side */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white z-10">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="mt-16 p-6 overflow-y-auto h-[calc(100vh-4rem)] bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};