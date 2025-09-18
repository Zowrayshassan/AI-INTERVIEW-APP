"use client";

import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import FormInterview from "../_components/formContainer";
import InterviewLink from "../_components/interviewLink";
import Questionlist from "../_components/questionlist";

const InterviewPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobTitle: "",
    duration: "",
    interviewType: "",
  });
  const [interviewId] = useState(uuidv4());

  const onHandleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleProgress = () => {
    if (
      formData?.jobPosition &&
      formData?.jobTitle &&
      formData?.duration &&
      formData?.interviewType
    ) {
      setStep((prev) => prev + 1);
    } else {
      alert("Fill all the fields");
    }
  };

  useEffect(() => {
    console.log("Form Data updated:", formData);
  }, [formData]);

  return (
    <div className="min-h-screen w-full flex flex-col sm:px-3 md:px-[7%] py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 w-full max-w-2xl font-bold text-xl sm:text-2xl mb-6"
      >
        <ArrowLeft
          className="w-6 h-6 cursor-pointer hover:text-gray-600 transition"
          onClick={() => router.back()}
        />
        <span>Create New Interview</span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="sm:w-50 md:w-100 lg:w-150 max-w-2xl mb-8 mx-auto"
      >
        <Progress value={step * 33} className="w-full" />
      </motion.div>

      {/* Steps */}
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <FormInterview
                formData={formData}
                onHandleChange={onHandleChange}
                progress={handleProgress}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <Questionlist
                formData={formData}
                progress={handleProgress}
                interviewId={interviewId}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <InterviewLink formData={formData} interviewId={interviewId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPage;
  