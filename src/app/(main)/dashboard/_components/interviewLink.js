"use client";

import {
  Calendar,
  Clock,
  HelpCircle,
  Linkedin,
  Mail,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const InterviewLink = ({ formData, interviewId }) => {
  const [copied, setCopied] = useState(false);

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/interview/${interviewId}`;
  const duration = formData?.duration || "30 Minutes";
  const totalQuestions = formData?.questionList?.length || 10;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=AI Interview Invitation&body=Please join the interview using this link: ${link}`;
  };

  const shareSlack = () => {
    // This will only redirect to Slack, not send a message automatically
    window.open("https://slack.com/app_redirect?channel=general", "_blank");
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      "Join the AI Interview: " + link
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        link
      )}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center min-h-5 px-4 lg:justify-start lg:ml-36 lg:min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full lg:w-[600px] max-w-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-3">
            <Image src="/tick.png" alt="success" width={36} height={36} />
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-semibold text-center mb-1">
          Your AI Interview is Ready!
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Share this link with your candidates to start the interview process or
          Copy in new tab to start your interview
        </p>

        <div className="border rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Interview Link
            </span>
            <span className="text-xs text-black border border-black px-2 py-0.5 rounded mt-2 sm:mt-0">
              Valid for 30 days
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-gray-800 text-sm break-all">{link}</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded hover:bg-gray-800 transition w-full sm:w-auto"
            >
              {copied ? "✅ Copied" : "Copy Link"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-start gap-3 sm:gap-8 text-gray-600 text-sm mb-6 pl-1">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-500" /> {duration}
          </div>
          <div className="flex items-center gap-1">
            <HelpCircle size={16} className="text-gray-500" /> {totalQuestions}{" "}
            Questions
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-500" /> Expires:{" "}
            {expiryDate.toDateString()}
          </div>
        </div>

        <h2 className="text-gray-700 mb-3 font-medium text-sm pl-1">
          Share via
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            <Mail size={16} /> Email
          </button>
          <button
            onClick={shareSlack}
            className="flex items-center justify-center gap-2 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            <MessageSquare size={16} /> Slack
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            🟢 WhatsApp
          </button>
          <button
            onClick={shareLinkedIn}
            className="flex items-center justify-center gap-2 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            <Linkedin size={16} /> LinkedIn
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Link href="/dashboard">
            <button className="px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-gray-100 transition">
              ← Back to Dashboard
            </button>
          </Link>
          <Link href={"/dashboard/interviewpage"}>
            <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition">
              + Create New Interview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewLink;
