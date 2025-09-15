import { Phone, VideoIcon } from "lucide-react";
import Link from "next/link";

const Options = () => {
  return (
    <div>
      <h1 className="font-bold ml-10 text-xl mt-3">DashBoard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-5 sm:ml-10 mt-3 ">
        <Link href={"/dashboard/interviewpage"}>
          <div className="bg-white w-full p-5 border rounded-lg hover:cursor-pointer hover:bg-gray-100 transition ease-in">
            <VideoIcon />
            <h1 className="font-bold mt-1">Create New Interview</h1>
            <p className="text-sm text-gray-500">
              Create AI Interview and scheduled them with Candidates
            </p>
          </div>
        </Link>

        <div className="bg-white w-full p-5 border rounded-lg">
          <Phone />
          <h1 className="font-bold mt-1">Create New Interview</h1>
          <p className="text-sm text-gray-500">
            Schedule phone screening call with candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Options;
