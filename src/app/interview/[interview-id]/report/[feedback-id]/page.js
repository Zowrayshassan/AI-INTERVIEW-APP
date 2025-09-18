"use client";
import { supabase } from "@/lib/supbaseClient";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CandidateReport() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params["interview-id"];
  const feedbackId = params["feedback-id"];

  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId && feedbackId) {
      const fetchData = async () => {
        setLoading(true);

        const { data: interviewData } = await supabase
          .from("interviews")
          .select("id, jobTitle, jobPosition, duration")
          .eq("id", interviewId)
          .single();

        const { data: feedbackData } = await supabase
          .from("interview_feedbacks")
          .select("id, feedback, created_at")
          .eq("id", feedbackId)
          .single();

        if (!interviewData || !feedbackData) {
          setLoading(false);
          return;
        }

        setInterview(interviewData);
        setFeedback(feedbackData);
        setParsedData(parseFeedback(feedbackData.feedback));
        setLoading(false);
      };
    }
  }, [interviewId, feedbackId]);

  // Improved feedback parser
  const parseFeedback = (text) => {
    const questionRegex =
      /QUESTION\s\d+:(.*?)ANSWER SUMMARY:(.*?)FEEDBACK:(.*?)SCORE:\s(\d+)\/10/gs;

    const ratingsBlock =
      text.match(/Technical.*|Communication.*|Confidence.*|Suitability.*/gs) ||
      [];

    const questions = [];
    let match;
    while ((match = questionRegex.exec(text)) !== null) {
      questions.push({
        question: match[1].trim(),
        answer: match[2].trim(),
        feedback: match[3].trim(),
        score: parseInt(match[4]),
      });
    }

    const ratings = ratingsBlock.map((line) => {
      const [category, scorePart] = line.split(":");
      return {
        category: category.trim(),
        score: parseInt(scorePart),
      };
    });

    return {
      questions,
      ratings,
      overall: "Candidate performed well across categories.",
      recommendation: "Recommended for further consideration.",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <motion.div
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  if (!interview || !feedback || !parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Report not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl space-y-10"
      >
        <div className="bg-neutral-100 p-5 rounded-xl shadow border border-neutral-200">
          <h1 className="text-2xl font-bold">{interview.jobPosition}</h1>
          <p className="text-gray-500 text-xs mt-2">
            Duration: {interview.duration} mins · Report Date:{" "}
            {new Date(feedback.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-neutral-100 p-6 rounded-xl shadow border border-neutral-200 space-y-6">
          <h2 className="text-lg font-semibold">Skills Assessment</h2>
          {parsedData.questions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm space-y-2"
            >
              <p className="font-medium text-gray-900">Q: {item.question}</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Answer Summary:</span>{" "}
                {item.answer}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Feedback:</span> {item.feedback}
              </p>
              <div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score * 10}%` }}
                    transition={{ duration: 1 }}
                    className="h-2 rounded-full bg-black"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Score: {item.score}/10
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-neutral-100 p-6 rounded-xl shadow border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Final Ratings</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parsedData.ratings}>
                <XAxis dataKey="category" stroke="#555" />
                <YAxis domain={[0, 10]} stroke="#555" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#000" }}
                />
                <Bar dataKey="score" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-100 p-6 rounded-xl shadow border border-neutral-200">
          <h2 className="text-lg font-semibold mb-3">Performance Summary</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            {parsedData.overall}
          </p>
        </div>

        <div className="border border-neutral-200 rounded-xl p-6 text-center shadow bg-white">
          <h3 className="text-lg font-bold">{parsedData.recommendation}</h3>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push(`/dashboard`)}
            className="text-gray-500 hover:text-black text-sm transition"
          >
            ← Back to Interview
          </button>
        </div>
      </motion.div>
    </div>
  );
}
