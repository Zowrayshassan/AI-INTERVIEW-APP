"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import Image from "next/image";

const LoginPage = () => {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.log("Google Login Error:", error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-20">
        <Image src="/login.png" alt="logo" width={500} height={200} />
      </div>

      <h3 className="text-center font-bold text-2xl">
        Welcome to AI-Powered Interview App
      </h3>

      <Button
        onClick={signInWithGoogle}
        className="mt-5 w-120 flex justify-center items-center mx-auto"
      >
        <Image src="/google.png" alt="google-logo" width={40} height={40} />
        Login with Google
      </Button>
    </div>
  );
};

export default LoginPage;
