"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import { useUser } from "@/provider";
import { motion } from "framer-motion";
import { Plus, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

const Interviewlist = ({ isSidebarOpen }) => {
  const [interviewList, setinterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const getInterviews = async () => {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("userEmail", user?.email);
      if (error) {
        console.error("Error fetching interviews:", error);
      } else {
        setinterviewList(interviews);
      }
    };
  }, [user]);

  return (
    <div className="px-6">
      <h1 className="font-bold text-xl text-center m-5">
        Previously Created Interviews
      </h1>
      <div
        className={`flex flex-wrap gap-5 transition-all duration-300 
          ${isSidebarOpen ? "justify-start lg:ml-8" : "justify-center"}
        `}
      >
        {interviewList?.length === 0 ? (
          <div className="text-center mx-auto">
            <VideoIcon className="mx-auto w-10 h-10 text-gray-400" />
            <h1 className="font-bold text-xl mt-3 text-gray-500">
              No Interviews Created !
            </h1>
          </div>
        ) : (
          interviewList.map((interview, idx) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <InterviewCard interview={interview} />
            </motion.div>
          ))
        )}
      </div>

      <div className="text-center mt-8">
        <Link href="dashboard/interviewpage">
          <Button>
            <Plus className="mr-2" /> Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Interviewlist;
