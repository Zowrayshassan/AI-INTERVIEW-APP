"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supbaseClient";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.log("Google Login Error:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center items-center mb-5"
      >
        <Image
          src="/login.png"
          alt="logo"
          width={550}
          height={200}
          className="border shadow-2xl"
        />
      </motion.div>

      {/* Heading */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        className="text-center font-bold text-2xl mb-5"
      >
        Welcome to AI-Powered Interview App
      </motion.h3>

      {/* Google Login Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Button
          onClick={signInWithGoogle}
          disabled={loading}
          className="mt-1 w-full flex justify-center items-center mx-auto"
        >
          {loading ? (
            <div className="flex space-x-1">
              <span className="dot animate-bounce delay-0"></span>
              <span className="dot animate-bounce delay-200"></span>
              <span className="dot animate-bounce delay-400"></span>
              <span className="dot animate-bounce delay-600"></span>
            </div>
          ) : (
            <>
              <Image
                src="/google.png"
                alt="google-logo"
                width={40}
                height={40}
              />
              <span className="ml-2">Login with Google</span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Loader Dots CSS */}
      <style jsx>{`
        .dot {
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          display: inline-block;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
