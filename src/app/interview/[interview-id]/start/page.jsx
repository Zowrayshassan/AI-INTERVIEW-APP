"use client";

import { interviewDataContext } from "@/context/interviewData";
import Vapi from "@vapi-ai/web";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Mic,
  Phone,
  Timer,
  XCircle,
} from "lucide-react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error"
  const timerRef = useRef(null);
  const router = useRouter();

  const interviewId = interviewInfo?.interview?.id;

  const buildAssistantOptions = () => {
    if (!interviewInfo) {
      alert("Please entre your name and email before starting the interview");
    }

    return {
      name: "AI Recruiter",
      firstMessage: `Hi ${
        interviewInfo.userName || "Candidate"
      }, how are you? Ready for your interview on ${
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
Your job is to ask candidates the provided interview questions and assess their responses.
Begin with a friendly introduction, setting a relaxed yet professional tone.
Ask one question at a time and wait for the candidate’s response before moving on.
Keep questions clear and concise.

Below are the questions to ask one by one:
${interviewInfo.interview?.questionList?.join("\n")}

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

  // Initialize Vapi
  useEffect(() => {
    if (!interviewInfo) return;
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
    v.on("speech-start", () => setIsSpeaking(true));
    v.on("speech-stop", () => setIsSpeaking(false));
    setVapi(v);
  }, [interviewInfo]);

  const startCall = () => {
    const options = buildAssistantOptions();
    if (!vapi || !options) return;
    setIsRinging(true);
    vapi.start(options);

    vapi.on("speech-start", () => {
      setIsRinging(false);
      setIsSpeaking(true);
    });
    vapi.on("speech-stop", () => setIsSpeaking(false));

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const text = message.transcript;
        const role = message.role === "assistant" ? "assistant" : "candidate";
        setConversation((prev) => [...prev, { role, text }]);
      }
    });

    timerRef.current = setInterval(() => setDuration((prev) => prev + 1), 1000);
  };

  const endCall = async () => {
    if (vapi) vapi.stop();
    setIsRinging(false);
    setIsSpeaking(false);
    clearInterval(timerRef.current);
    setDuration(0);

    if (!interviewId) return console.error("No interviewId to save.");

    setIsSaving(true);
    setSaveStatus(null);
    const userEmail = interviewInfo.userEmail;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          userEmail,
          conversation: conversation.length
            ? conversation
            : [{ role: "system", text: "No conversation recorded." }],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("success");
        setTimeout(() => router.push(`/dashboard`), 1500);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
      console.error("Error saving feedback:", err);
    } finally {
      setIsSaving(false);
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
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
            AI Interview Session
          </h2>
          <span className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
            <Timer className="w-6 h-6" /> {formatDuration(duration)}
          </span>
        </motion.div>

        {/* Interviewer & Candidate */}
        <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto mt-8">
          {/* Interviewer */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center p-6 border rounded-lg bg-white shadow relative"
          >
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
                alt="interviewer"
                className="rounded-full mb-3 w-20 h-20 object-cover"
                width={80}
                height={80}
              />
            </motion.div>
            <p className="text-sm font-medium">Interviewer</p>
            {isRinging && (
              <p className="text-xs text-blue-500 mt-2 animate-pulse">
                Ringing...
              </p>
            )}
          </motion.div>

          {/* Candidate */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center p-6 border rounded-lg bg-white shadow"
          >
            <div className="flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-3 w-20 h-20 text-2xl">
              {interviewInfo?.userName?.charAt(0).toUpperCase() || "G"}
            </div>
            <p className="text-sm font-medium">
              {interviewInfo?.userName || "Guest"}
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center gap-20 mt-10"
        >
          <Mic
            onClick={startCall}
            className="h-12 w-12 p-3 bg-gray-500 rounded-full cursor-pointer text-white hover:scale-105 transition"
          />
          <Phone
            onClick={endCall}
            className="h-12 w-12 p-3 bg-red-500 rounded-full cursor-pointer text-white hover:scale-105 transition"
          />
        </motion.div>

        {/* Loader / Toast */}
        {isSaving && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-700 font-medium">
                Generating Feedback...
              </p>
            </motion.div>
          </div>
        )}
        {saveStatus === "success" && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg animate-bounce"
          >
            <CheckCircle2 className="h-5 w-5" /> Feedback Saved!
          </motion.div>
        )}
        {saveStatus === "error" && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg animate-bounce"
          >
            <XCircle className="h-5 w-5" /> Error Saving Feedback
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default InterviewStartPage;
