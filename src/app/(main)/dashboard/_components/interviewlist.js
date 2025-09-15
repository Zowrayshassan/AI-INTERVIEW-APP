"use client";
import { Button } from "@/components/ui/button";
import { Plus, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Interviewlist = () => {
  const [interviewList, setinterviewList] = useState([]);
  return (
    <div>
      <h1 className="font-bold text-xl m-5 ml-11">
        Previously Created Interviews
      </h1>
      <div className="w-fit mx-auto">
        <VideoIcon className="ml-15 w-10 h-10" />
        {interviewList?.lenght == 0 && (
          <div>
            {
              <h1 className="font-bold text-xl m-5 ml-11">
                No Interviews Created !
              </h1>
            }
          </div>
        )}
        <Link href="dashboard/interviewpage">
          <Button className="mt-5 max-w-2xl">
            <Plus />
            Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Interviewlist;
