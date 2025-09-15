"use client";
import { interviewDataContext } from "@/context/interviewData";
import Vapi from "@vapi-ai/web";
import { motion } from "framer-motion";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const InterviewStartPage = () => {
  const { interviewInfo } = useContext(interviewDataContext);
  const [vapi, setVapi] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [conversation, setConversation] = useState([]);
  const timerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!interviewInfo) {
      console.log("Interview info not ready yet...");
      return;
    }

    console.log("this is the interview info final", interviewInfo);

    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);

    v.on("speech-start", () => setIsSpeaking(true));
    v.on("speech-stop", () => setIsSpeaking(false));

    setVapi(v);
  }, [interviewInfo]);

  const buildAssistantOptions = () => {
    if (!interviewInfo) return null;

    return {
      name: "AI Recruiter",
      firstMessage: `Hi ${
        interviewInfo.userName || "Candidate"
      }, how are you ? Ready for your interview on ${
        interviewInfo.interview?.jobPosition || "this role"
      }?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
  You are an AI voice assistant conducting interviews.
  Your job is to ask candidates provided interview questions, assess their responses.
  Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
  
  Ask one question at a time and wait for the candidate’s response before proceeding. 
  Keep the questions clear and concise. Below are the questions to ask one by one:
  
  Questions: ${interviewInfo.interview?.questionList?.join("\n")}
  
  Provide brief, encouraging feedback after each answer.
  
  After ${
    interviewInfo.interview?.duration || 15
  } minutes, wrap up the interview smoothly.
            `.trim(),
          },
        ],
      },
    };
  };

  const startCall = () => {
    const options = buildAssistantOptions();
    if (vapi && options) {
      setIsRinging(true);

      vapi.start(options);
      console.log("Call started with options:", options);

      vapi.on("speech-start", () => {
        setIsRinging(false);
        setIsSpeaking(true);
      });

      vapi.on("message", (message) => {
        if (message.type === "transcript") {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const endCall = async () => {
    if (vapi) {
      vapi.stop();
      console.log("Call ended");
    }
    setIsRinging(false);
    setIsSpeaking(false);
    clearInterval(timerRef.current);
    setDuration(0);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interviewInfo?.interviewId,
          conversation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Feedback saved:", data.feedback);
        router.push(`/interview//${interviewInfo?.interviewId}/feedback`);
      } else {
        console.error("Feedback save failed:", data.error);
      }
    } catch (err) {
      console.error("Error saving feedback:", err);
    }
  };

  const formatDuration = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
            AI Interview Session
          </h2>
          <span className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Timer className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            {formatDuration(duration)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-16 md:gap-32 lg:gap-60 w-full max-w-4xl h-auto mx-auto">
          {/* Interviewer */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg bg-white shadow relative">
            <motion.div
              animate={
                isRinging
                  ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }
                  : isSpeaking
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0px #00f",
                        "0 0 20px #00f",
                        "0 0 0px #00f",
                      ],
                    }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="rounded-full"
            >
              <Image
                src="/potrait.png"
                alt="candidate"
                className="rounded-full mb-3 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
                width={200}
                height={300}
              />
            </motion.div>
            <p className="text-xs sm:text-sm md:text-base font-medium">
              Interviewer
            </p>
            {isRinging && (
              <p className="text-xs text-blue-500 mt-2 animate-pulse">
                Ringing...
              </p>
            )}
          </div>

          {/* Candidate */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg bg-white shadow">
            <div
              className="flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-3 
                            w-16 h-16 text-xl sm:w-20 sm:h-20 sm:text-2xl md:w-24 md:h-24 md:text-3xl"
            >
              {interviewInfo?.userName?.charAt(0).toUpperCase() || "G"}
            </div>
            <p className="text-xs sm:text-sm md:text-base font-medium">
              {interviewInfo?.userName || "Guest"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center w-full sm:px-8 md:px-16 lg:px-32 mt-8 sm:mt-10 gap-6 sm:gap-12 md:gap-32 lg:gap-60">
          <div className="flex justify-center w-1/2">
            <Mic
              onClick={startCall}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 p-2.5 sm:p-3 bg-gray-500 rounded-full cursor-pointer"
            />
          </div>
          <div className="flex justify-center w-1/2">
            <Phone
              onClick={endCall}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 p-2.5 sm:p-3 bg-red-500 rounded-full cursor-pointer"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewStartPage;
