"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const params = useParams();
  const interviewId = params["interview-id"];
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await fetch(`/api/getFeedback?id=${interviewId}`);
      const data = await res.json();
      setFeedback(data.feedback);
    };
    if (interviewId) fetchFeedback();
  }, [interviewId]);

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white border border-gray-200 shadow-lg rounded-xl p-8"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-6 text-center text-gray-900"
        >
          Interview Feedback
        </motion.h1>

        {/* Feedback content */}
        <div className="space-y-4">
          {feedback.split("\n").map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="text-gray-700 leading-relaxed text-base border-b last:border-b-0 border-gray-100 pb-2"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
