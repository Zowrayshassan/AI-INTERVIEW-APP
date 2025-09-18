"use client";
import { supabase } from "@/lib/supbaseClient";
import { useUser } from "@/provider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ScheduleInterviews = ({ isSidebarOpen }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getFeedbacks = async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(
          `
          id,
          jobTitle,
          jobPosition,
          duration,
          interview_feedbacks:interview_feedbacks_interview_id_fkey (
            id,
            feedback,
            created_at
          )
        `
        )
        .eq("userEmail", user?.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching feedbacks:", error);
      } else {
        setFeedbackList(data);
      }
    };
    getFeedbacks();
  }, [user]);

  return (
    <div className="px-6 py-10 min-h-screen">
      <div
        className={`flex flex-wrap gap-5 mt-3 transition-all duration-300
          ${isSidebarOpen ? "justify-start ml-5 sm:ml-10" : "justify-center"}
        `}
      >
        {feedbackList.map((interview) => {
          const candidateCount = interview.interview_feedbacks?.length || 0;

          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-72 mt-5 p-5 border rounded-lg shadow-sm flex flex-col justify-between hover:bg-gray-50 transition ease-in"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {interview.jobPosition?.[0] || "?"}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  {interview.jobPosition}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {interview.jobTitle}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Duration: {interview.duration} Min
                </p>
                <p className="text-sm font-medium text-green-600">
                  {candidateCount}{" "}
                  {candidateCount === 1 ? "Candidate" : "Candidates"}
                </p>
              </div>
              <button
                onClick={() => router.push(`/interview/${interview.id}/fdback`)}
                className="mt-6 w-full bg-transparent border text-black hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition"
              >
                View Detail →
              </button>
            </motion.div>
          );
        })}

        {feedbackList.length === 0 && (
          <p
            className={`text-gray-500 font-bold text-xl w-full transition-all duration-300
              ${isSidebarOpen ? "text-left ml-5 sm:ml-10" : "text-center"}
            `}
          >
            No interviews found yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduleInterviews;
