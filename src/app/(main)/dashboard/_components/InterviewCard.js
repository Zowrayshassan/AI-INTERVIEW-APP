"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Copy, Send } from "lucide-react";

const InterviewCard = ({ interview, isSidebarOpen }) => {
  const { created_at, jobTitle, jobPosition, duration, interviewID } =
    interview;

  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const interviewLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/interview/${interviewID}`
      : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(interviewLink);
    alert("✅ Link copied to clipboard!");
  };

  const handleSend = () => {
    const subject = encodeURIComponent("Interview Invitation");
    const body = encodeURIComponent(
      `Hello,\n\nHere is your interview link:\n${interviewLink}\n\nRegards,\nInterview Team`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className={`border rounded-xl shadow-md bg-white p-5 w-72 flex flex-col justify-between transition-all duration-300
        ${isSidebarOpen ? "sm:ml-20 md:ml-16" : "mx-auto"}
      `}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{formattedDate}</span>
      </div>

      <div className="mt-3">
        <h2 className="font-bold text-lg">{jobPosition}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{jobTitle}</p>
      </div>

      <div className="mt-2 text-sm flex items-center gap-2 text-gray-700">
        <Calendar size={16} />
        {duration || "30 Min"}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-1" /> Copy Link
        </Button>
        <Button size="sm" onClick={handleSend}>
          <Send className="w-4 h-4 mr-1" /> Send
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
