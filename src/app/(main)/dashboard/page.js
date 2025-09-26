"use client";

import { supabase } from "@/lib/supabaseClient"; // Make sure path is correct
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Interviewlist from "./_components/interviewlist";
import Options from "./_components/options";

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Options />
      <Interviewlist />
    </div>
  );
};

export default Page;
