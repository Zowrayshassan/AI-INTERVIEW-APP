"use client";
import { interviewDataContext } from "@/context/interviewData";
import { supabase } from "@/lib/supbaseClient";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const InterviewJoinPage = () => {
  const { "interview-id": interviewId } = useParams(); // ✅ correctly destructure param
  const [interviewData, setInterviewData] = useState(null);
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(true);
  const { interviewInfo, setInterviewInfo } = useContext(interviewDataContext);

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
      console.log("Fetched interview:", data);
      setInterviewData(data);
      setloading(false);
    }
  };

  const onJoinInterview = async () => {
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interviewID", interviewId);

    setInterviewInfo({
      userName: name,
      userEmail: email,
      interview: interviews[0],
    });
    router.push(`/interview/${interviewId}/start`);

    console.log("just set:", {
      userName: name,
      interview: interviews[0],
    });
  };

  useEffect(() => {
    if (interviewId) getInterviewDetails();
  }, [interviewId]);

  return (
    <div className="flex items-center justify-center min-h-screen text-black px-4">
      <div className="w-full max-w-md border bg-gray-100 shadow-2xl rounded-xl p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">AIcruiter</h1>
          <p className="text-gray-600 text-sm">AI-Powered Interview Platform</p>
        </div>

        <h2 className="text-lg font-semibold">
          {interviewData?.jobPosition || "Loading..."}
        </h2>

        <Image
          src="/login.png"
          alt="img"
          width={200}
          height={50}
          className="shadow-2xl border rounded-lg"
        />

        <p className="text-gray-700 flex items-center gap-2 text-sm">
          ⏱ {interviewData?.duration || 30} Minutes
        </p>

        <div className="w-full">
          <label className="block text-sm mb-1">Enter your full name</label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            className="w-full border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Enter your Email </label>
          <input
            type="text"
            placeholder="e.g. "
            className="w-full border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full bg-gray-100 border border-black rounded-lg p-3 text-xs">
          <p className="font-medium mb-1 flex items-center gap-1">
            ℹ Before you begin
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-700">
            <li>Test your camera and microphone</li>
            <li>Ensure you have a stable internet connection</li>
            <li>Find a quiet place for interview</li>
          </ul>
        </div>

        <button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition  disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || !name}
          onClick={onJoinInterview}
        >
          Join Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewJoinPage;
