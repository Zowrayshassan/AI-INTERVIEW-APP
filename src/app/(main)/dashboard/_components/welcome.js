"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/provider";
import { BellIcon, Menu } from "lucide-react";
import { useState } from "react";

const Welcome = ({ isSidebarOpen }) => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`bg-white w-full border max-w-4xl rounded-2xl p-4 md:p-5 mt-3 shadow-sm transition-all duration-300
      ${isSidebarOpen ? "sm:ml-20 md:ml-16" : "mx-auto"}`}
    >
      <div className="flex items-center justify-start gap-9">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            Welcome, {user?.user_metadata?.name ?? "User"}
          </h1>
          <p className="text-sm text-gray-500 truncate">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>
        </div>

        <div className="relative flex items-center">
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <BellIcon className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <button
            className="md:hidden p-2 border rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-md p-3 flex flex-col gap-3 w-44">
              <BellIcon className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {user?.user_metadata?.name ?? "User"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
