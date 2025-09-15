"use client";

import { Progress } from "@/components/ui/progress";
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
      alert(" Fill all the feilds");
    }
  };
  useEffect(() => {
    console.log("Form Data updated:", formData);
  }, [formData]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center sm:px-3 md:px-[20%] py-6">
      <div className="flex items-center gap-2 w-full max-w-2xl font-bold text-xl sm:text-2xl mb-6">
        <ArrowLeft
          className="w-6 h-6 cursor-pointer hover:text-gray-600 transition"
          onClick={() => router.back()}
        />
        <span className="">Create New Interview</span>
      </div>
      <div className="sm:w-50 md:w-100 lg:w-150 max-w-2xl mb-8 mx-auto">
        <Progress value={step * 33} className="w-full" />
      </div>
      {step == 1 && (
        <div className="w-full max-w-2xl">
          <FormInterview
            formData={formData}
            onHandleChange={onHandleChange}
            progress={handleProgress}
          />
        </div>
      )}

      {step == 2 && (
        <div>
          <Questionlist
            formData={formData}
            progress={handleProgress}
            interviewId={interviewId}
          />
        </div>
      )}

      {step == 3 && (
        <div>
          <InterviewLink formData={formData} interviewId={interviewId} />
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
