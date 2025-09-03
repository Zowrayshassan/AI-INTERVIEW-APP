"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // clear session
    router.push("/auth"); // redirect back to login page
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Button
        onClick={handleLogout}
        className="mt-5 bg-red-500 text-white px-4 py-2"
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
