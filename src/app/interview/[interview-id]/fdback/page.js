"use client";
import { supabase } from "@/lib/supbaseClient";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InterviewDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params["interview-id"];
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    if (id) fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select(
        `
        id,
        jobTitle,
        jobPosition,
        duration,
        created_at,
        userEmail,
        interview_feedbacks:interview_feedbacks_interview_id_fkey (
          id,
          feedback,
          created_at,
          userEmail
        )
      `
      )
      .eq("id", id)
      .single();

    if (!error) setInterview(data);
  };

  if (!interview)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading interview...
      </div>
    );

  const feedbacks = interview.interview_feedbacks || [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {interview.jobPosition}
        </h1>
        <p className="text-gray-600 mb-6">{interview.jobTitle}</p>

        <p className="text-sm text-gray-500 mb-4">
          ⏱ Duration: {interview.duration} minutes
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Created: {new Date(interview.created_at).toLocaleDateString()}
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidates</h2>

        {feedbacks.length > 0 ? (
          <ul className="divide-y divide-gray-200 rounded-lg border">
            {feedbacks.map((fb) => (
              <li
                key={fb.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">
                  {fb.userEmail}
                </span>
                <button
                  className="text-black-600 hover:underline text-sm"
                  onClick={() =>
                    router.push(`/interview/${id}/report/${fb.id}`)
                  }
                >
                  View Report →
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No candidates yet.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewDetail;
