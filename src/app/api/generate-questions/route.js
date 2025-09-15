import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  const questions = await req.json();
  const { formData } = questions;

  const prompt = `
  You are an expert technical recruiter.  
  Generate interview questions tailored to the role and market trends.  
  
  Position: ${formData.jobPosition}  
  Job Details: ${formData.jobTitle}  
  Interview Duration: ${formData.duration} minutes  
  Interview Type: ${formData.interviewType.join(", ")}  
  
  Guidelines:  
  - Adjust the number of questions based on the interview duration 
    (shorter = fewer, longer = more) or Minimum 7 and Max 20.  
  - Ensure all questions are relevant, concise, and up-to-date with current industry practices.  
  - Mix technical, situational, and behavioral questions depending on the interview type.  
  - Return the questions in a clean, numbered list only (no explanations).  
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return new Response(
    JSON.stringify({ questions: response.choices[0].message.content }),
    { status: 200 }
  );
}
