"use client";
import { Button } from "@/components/ui/button";
import Provider from "@/provider";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function Page() {
  <Provider />;
  const [titleNumber, setTitleNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const titles = useMemo(
    () => [
      "Job Preparation",
      "Real Time Communication",
      "Feedbacks",
      "Interview Type",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="flex gap-8 py-15 lg:py-40 items-center justify-center flex-col"
        >
        
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h1 className="text-3xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Here you get</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center mt-5 md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
          </motion.div>

          {/* Paragraph */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center"
          >
            AI-powered interview prep is already essential. Skip outdated mock
            sessions and boring manuals. Our goal is to empower students, making
            job communication practice easier, smarter, and faster with
            real-time AI feedback.
          </motion.p>

  
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-row gap-3"
          >
            <Link href={loading ? "#" : "/auth"}>
              <Button
                size="lg"
                className="gap-4 flex justify-center items-center hover:scale-105 hover:shadow-lg hover:shadow-cyan-200 transition-transform duration-300"
                onClick={handleClick}
                disabled={loading}
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
                    Get Started
                    <MoveRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

    
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
}

export default Page;
