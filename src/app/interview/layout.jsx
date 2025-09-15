"use client";
import { interviewDataContext } from "@/context/interviewData";
import Image from "next/image";
import { useState } from "react";

export default function InterviewLayout({ children }) {
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
    <interviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div>
        <header className="flex items-center justify-center px-6 py-4 mb-3 mt-5 ">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image
              src="/LOGO.png"
              alt="candidate"
              className="w-50"
              width={100}
              height={100}
            />
          </h1>
        </header>
        {children}
      </div>
    </interviewDataContext.Provider>
  );
}
