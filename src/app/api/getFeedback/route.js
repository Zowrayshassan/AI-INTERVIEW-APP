import { supabase } from "@/lib/supbaseClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const interviewId = searchParams.get("id");

  if (!interviewId) {
    return NextResponse.json(
      { error: "Interview ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("interview_feedbacks")
    .select("feedback")
    .eq("interview_id", interviewId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feedback: data?.feedback || null });
}
