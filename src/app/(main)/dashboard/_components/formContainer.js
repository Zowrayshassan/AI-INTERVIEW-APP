"use client";
import { interviewType } from "@/app/services/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const FormInterview = ({ formData, onHandleChange, progress }) => {
  // local state for selected interview types
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    onHandleChange("interviewType", selectedTypes);
  }, [selectedTypes, onHandleChange]);

  const toggleType = (type) => {
    setSelectedTypes(
      (prev) =>
        prev.includes(type)
          ? prev.filter((t) => t !== type) // remove if already selected
          : [...prev, type] // add if not selected
    );
  };

  return (
    <div className="sm:w-full md:w-100 lg:w-150 justify-center ">
      <div className="w-full bg-white border mx-auto rounded-lg flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Job Position</label>
          <Input
            className="w-full bg-white"
            placeholder="e.g. Full stack developer"
            value={formData.jobPosition}
            onChange={(e) => onHandleChange("jobPosition", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Job Title</label>
          <Textarea
            className="w-full h-[100px] bg-white"
            placeholder="Write job details here..."
            value={formData.jobTitle}
            onChange={(e) => onHandleChange("jobTitle", e.target.value)}
          />
        </div>

        {/* Interview Duration */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Interview Duration</label>
          <Select onValueChange={(value) => onHandleChange("duration", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interview Types */}
        <div>
          {interviewType.map((interview, idx) => (
            <div
              key={idx}
              className={`gap-2 p-2 border rounded-lg mt-2 font-mono text-sm cursor-pointer transition 
                ${
                  selectedTypes.includes(interview.title)
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }
              `}
              onClick={() => toggleType(interview.title)}
            >
              <div className="flex gap-2">
                <interview.icon className="w-4 h-5 text-gray-600" />
                <span className="font-medium">{interview.title}</span>
              </div>
            </div>
          ))}

          <Button className="mt-4 w-full" onClick={progress}>
            Generate Questions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormInterview;
