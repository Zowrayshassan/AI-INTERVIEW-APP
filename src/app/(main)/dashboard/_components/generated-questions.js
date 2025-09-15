"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import { useUser } from "@/provider";

const Generatedquestions = ({
  formData,
  questions,
  loading,
  progress,
  interviewId,
}) => {
  const user = useUser();

  async function saveInfo() {
    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          userEmail: user?.email,
          interviewID: interviewId,
          questionList: questions,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving interview:", error);
    } else {
      console.log("Saved interview:", data);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md w-full max-w-6xl mx-auto mt-6">
      <h2 className="font-bold text-xl mb-6 text-gray-800 text-center">
        Generated Questions
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 animate-pulse">
            ⏳ Generating questions...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-4 w-full">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-5 border rounded-lg hover:shadow-lg transition-shadow bg-gray-50 flex flex-col w-full"
            >
              <p className="text-sm text-gray-400 mb-2">
                {formData.interviewType[idx] || "General"} question
              </p>
              <p className="text-gray-800 break-words">{q.trim()}</p>
            </div>
          ))}
          <Button
            onClick={() => {
              saveInfo(), progress();
            }}
          >
            Finish & Create Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default Generatedquestions;
