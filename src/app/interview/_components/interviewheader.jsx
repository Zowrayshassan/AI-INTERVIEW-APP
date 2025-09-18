"use client";
import { interviewDataContext } from "@/context/interviewData";
import { supabase } from "@/lib/supbaseClient";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const InterviewJoinPage = () => {
  const { "interview-id": interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { setInterviewInfo } = useContext(interviewDataContext);
  const router = useRouter();

  const getInterviewDetails = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("jobPosition, duration")
      .eq("interviewID", interviewId)
      .single();

    if (error) {
      console.error("Error fetching interview:", error.message);
    } else {
      setInterviewData(data);
      setloading(false);
    }
  };

  const onJoinInterview = async () => {
    setButtonLoading(true);
    let { data: interviews } = await supabase
      .from("interviews")
      .select("*")
      .eq("interviewID", interviewId);

    setInterviewInfo({
      userName: name,
      userEmail: email,
      interview: interviews[0],
    });

    // Small delay so dots show before redirect
    setTimeout(() => {
      router.push(`/interview/${interviewId}/start`);
    }, 800);
  };

  useEffect(() => {
    if (interviewId) getInterviewDetails();
  }, [interviewId]);

  // Framer Motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black px-4">
      <motion.div
        className="w-full max-w-md border bg-gray-100 shadow-2xl rounded-xl p-6 flex flex-col items-center gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-xl font-bold">AIcruiter</h1>
          <p className="text-gray-600 text-sm">AI-Powered Interview Platform</p>
        </motion.div>

        <motion.h2 className="text-lg font-semibold" variants={itemVariants}>
          {interviewData?.jobPosition || "Loading..."}
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Image
            src="/login.png"
            alt="img"
            width={200}
            height={50}
            className="shadow-2xl border rounded-lg"
          />
        </motion.div>

        <motion.p
          className="text-gray-700 flex items-center gap-2 text-sm"
          variants={itemVariants}
        >
          ⏱ {interviewData?.duration || 30} Minutes
        </motion.p>

        <motion.div className="w-full" variants={itemVariants}>
          <label className="block text-sm mb-1">Enter your full name</label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            className="w-full border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => setname(e.target.value)}
          />
        </motion.div>

        <motion.div className="w-full" variants={itemVariants}>
          <label className="block text-sm mb-1">Enter your Email </label>
          <input
            type="text"
            placeholder="e.g. "
            className="w-full border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="w-full bg-gray-100 border border-black rounded-lg p-3 text-xs"
          variants={itemVariants}
        >
          <p className="font-medium mb-1 flex items-center gap-1">
            ℹ Before you begin
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-700">
            <li>Test your camera and microphone</li>
            <li>Ensure you have a stable internet connection</li>
            <li>Find a quiet place for interview</li>
          </ul>
        </motion.div>

        <motion.button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={loading || !name || buttonLoading}
          onClick={onJoinInterview}
          whileHover={!buttonLoading ? { scale: 1.05 } : {}}
          whileTap={!buttonLoading ? { scale: 0.95 } : {}}
          variants={itemVariants}
        >
          {buttonLoading ? (
            <div className="flex space-x-2">
              <span className="dot animate-bounce delay-0"></span>
              <span className="dot animate-bounce delay-200"></span>
              <span className="dot animate-bounce delay-400"></span>
              <span className="dot animate-bounce delay-600"></span>
            </div>
          ) : (
            "Join Interview"
          )}
        </motion.button>
      </motion.div>

      <style jsx>{`
        .dot {
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          display: inline-block;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewJoinPage;
