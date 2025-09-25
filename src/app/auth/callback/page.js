"use client";
import { supabase } from "@/lib/supbaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard"); // ✅ logged in
      } else {
        router.push("/auth"); // ❌ go back to login
      }
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">Finishing login... ⏳</p>;
}
