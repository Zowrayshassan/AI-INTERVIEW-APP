import { supabase } from "@/lib/supbaseClient";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { interviewId, userEmail, conversation } = await req.json();

    // Normalize conversation -> use transcript instead of text
    let formatted = "";
    conversation.forEach((msg) => {
      const content = msg.text || msg.transcript || msg.output || "";
      formatted += `${msg.role === "assistant" ? "Q" : "A"}: ${content}\n`;
    });

    if (!formatted.trim()) {
      throw new Error("Conversation was empty or not formatted correctly.");
    }

    const prompt = `
    You are an experienced technical interviewer and career coach. 
    Below is a transcript of an AI-conducted interview. 
    
    Transcript:
    ${formatted}
    
    Your task is to analyze this interview and return structured feedback.
    
    For each *question and answer pair*:
    - Restate the question briefly.
    - Summarize the candidate’s answer.
    - Provide feedback: strengths, weaknesses, missing points.
    - Give a score (1–10) for that answer.
    
    After reviewing all Q&A:
    - Provide an **overall summary** of the candidate’s performance.
    - Give **three actionable tips** for improvement.
    - Provide final ratings:
      • Communication clarity (1–10)
      • Technical depth (1–10)
      • Confidence (1–10)
      • Overall suitability for the role (1–10)
    
    Return the output in this clear format:
    
    QUESTION 1: [short version of the question]
    ANSWER SUMMARY: [...]
    FEEDBACK: [...]
    SCORE: X/10
    
    QUESTION 2: ...
    ...
    
    ---
    OVERALL SUMMARY:
    [...]
    
    ACTIONABLE TIPS:
    1. [...]
    2. [...]
    3. [...]
    
    FINAL RATINGS:
    Communication Clarity: X/10
    Technical Depth: X/10
    Confidence: X/10
    Overall Suitability: X/10


    Final Recommendation Selected or Not Selected:
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    // ⚠️ Make sure interviewId is a number (not the UUID)
    const { error } = await supabase.from("interview_feedbacks").insert({
      interview_id: Number(interviewId), // ensure it's the int `id` (e.g. 31)
      transcript: conversation,
      userEmail,
      feedback,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, feedback }), {
      status: 200,
    });
  } catch (err) {
    console.error("Feedback API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
