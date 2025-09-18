"use client";
import { supabase } from "@/lib/supbaseClient";
import { useUser } from "@/provider";
import { motion } from "framer-motion";
import { VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";

const AllInterviews = ({ isSidebarOpen }) => {
  const [interviewList, setinterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getInterviews();

    const getInterviews = async () => {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("userEmail", user?.email);
      if (error) {
        console.error("Error fetching interviews:", error);
      } else {
        setinterviewList(interviews);
      }
    };
  }, [user]);

  return (
    <div
      className={`mt-10 flex flex-wrap gap-4 transition-all duration-300 p-8
        ${isSidebarOpen ? "justify-start lg:ml-8" : "justify-center"}
      `}
    >
      {interviewList?.length === 0 ? (
        <div className="text-center w-full">
          <VideoIcon className="mx-auto w-10 h-10 text-gray-500" />
          <h1 className="font-bold text-xl text-center mt-3 text-gray-500">
            No Interviews Created!
          </h1>
        </div>
      ) : (
        interviewList.map((interview, idx) => (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <InterviewCard interview={interview} />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AllInterviews;
