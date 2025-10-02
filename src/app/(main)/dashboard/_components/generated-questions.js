"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import { useUser } from "@/provider";
import { motion } from "framer-motion";
import { useState } from "react";

const Generatedquestions = ({
  formData,
  questions,
  loading,
  progress,
  interviewId,
}) => {
  const { user } = useUser();
  const [loadingButton, setLoadingButton] = useState(false);

  async function saveInfo() {
    try {
      setLoadingButton(true);

      const { data, error } = await supabase
        .from("interviews")
        .insert([
          {
            ...formData,
            userEmail: user?.email,
            interviewID: interviewId,
            questionList: questions,
          },
        ])
        .select();

      if (error) {
        console.error("Error saving interview:", error);
        alert("Failed to save interview. Please try again.");
      } else {
        console.log("Saved interview:", data);
        progress();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingButton(false);
    }
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="p-6 rounded-lg border shadow-md w-full max-w-6xl mx-auto mt-6">
      <h2 className="font-bold text-xl mb-6 text-gray-800 text-center">
        Generated Questions
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="flex space-x-2">
            <span className="dot animate-bounce delay-0"></span>
            <span className="dot animate-bounce delay-200"></span>
            <span className="dot animate-bounce delay-400"></span>
            <span className="dot animate-bounce delay-600"></span>
          </div>
          <p className="mt-4 text-gray-600 mx-auto animate-pulse">
            ⏳ Generating questions...
          </p>
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-6 mt-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questions.map((q, idx) => (
            <motion.div
              key={idx}
              className="p-5 border rounded-lg hover:shadow-lg transition-shadow bg-gray-50 flex flex-col w-full"
              variants={questionVariants}
            >
              <p className="text-sm text-gray-400 mb-2">
                {formData.interviewType[idx] || "General"} question
              </p>
              <p className="text-gray-800 break-words">{q.trim()}</p>
            </motion.div>
          ))}

          <Button
            onClick={saveInfo}
            disabled={loadingButton}
            className="flex justify-center items-center gap-2 min-h-[44px] touch-manipulation"
            type="button"
          >
            {loadingButton ? (
              <div className="flex space-x-1">
                <span className="dot animate-bounce delay-0"></span>
                <span className="dot animate-bounce delay-200"></span>
                <span className="dot animate-bounce delay-400"></span>
                <span className="dot animate-bounce delay-600"></span>
              </div>
            ) : (
              "Finish & Create Link"
            )}
          </Button>
        </motion.div>
      )}

      <style jsx>{`
        .dot {
          width: 10px;
          height: 10px;
          background-color: black;
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

export default Generatedquestions;
