"use client";

import Interviewlist from "./_components/interviewlist";
import Options from "./_components/options";

const Page = () => {
  return (
    <div>
      <Options />
      <Interviewlist />
    </div>
    // <motion.div
    //   initial={{ opacity: 0, x: -30 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   transition={{ delay: 0.2, duration: 0.5 }}
    // >

    // <motion.div
    //   initial={{ opacity: 0, x: -30 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   transition={{ delay: 0.4, duration: 0.5 }}
    // >

    //   </motion.div>
    // </motion.div>
  );
};

export default Page;
