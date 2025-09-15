"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const { interviewId } = useParams();
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await fetch(`/api/getFeedback?id=${interviewId}`);
      const data = await res.json();
      setFeedback(data.feedback);
    };
    if (interviewId) {
      fetchFeedback();
    }
  }, [interviewId]);

  if (!feedback) return <p className="p-6">Loading feedback...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Interview Feedback</h1>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg shadow">
        {feedback}
      </pre>
    </div>
  );
}
