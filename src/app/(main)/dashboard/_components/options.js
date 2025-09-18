"use client";
import { motion } from "framer-motion";
import { Phone, VideoIcon } from "lucide-react";
import Link from "next/link";

const Options = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="font-bold text-xl mb-6 ml-2"></h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href={"/dashboard/interviewpage"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 border rounded-lg shadow-sm hover:cursor-pointer hover:bg-gray-100 transition ease-in"
          >
            <VideoIcon className="w-6 h-6 text-gray-700" />
            <h1 className="font-bold mt-2 text-lg">Create New Interview</h1>
            <p className="text-sm text-gray-500">
              Create AI Interview and schedule them with Candidates
            </p>
          </motion.div>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }} // stagger effect
          className="bg-white p-5 border rounded-lg shadow-sm"
        >
          <Phone className="w-6 h-6 text-gray-700" />
          <h1 className="font-bold mt-2 text-lg">Schedule Phone Call</h1>
          <p className="text-sm text-gray-500">
            Schedule phone screening call with candidates
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Options;
