import { useEffect, useState } from "react";
import Generatedquestions from "./generated-questions";

export default function Questions({ formData, progress, interviewId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData }),
        });
        const data = await res.json();

        const qArray = data?.questions
          ? data.questions.split(/\n\d+\.\s/).filter(Boolean)
          : [];

        setQuestions(qArray);
      } catch (err) {
        console.error(err);
        setQuestions(["Error generating questions."]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [formData]);

  return (
    <div>
      <Generatedquestions
        formData={formData}
        loading={loading}
        questions={questions}
        progress={progress}
        interviewId={interviewId}
      ></Generatedquestions>
    </div>
  );
}
