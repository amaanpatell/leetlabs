import React, { useState } from "react";
import {
  Clock,
} from "lucide-react";

const SubmissionResults = ({ submissions }) => {
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  // Get the latest submission (first one in the array)
  // const latestSubmission = submissions[0];
  const avgMemory = calculateAverageMemory(latestSubmission.memory);
  const avgTime = calculateAverageTime(latestSubmission.time);

  return (
    <div>
      <h2 className="text-foreground text-lg font-medium mb-4 text-left">
        Last Submission
      </h2>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`font-medium text-base ${
              latestSubmission.status === "Accepted"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {latestSubmission.status}
          </span>
        </div>
        <p className="text-muted-foreground text-sm text-left">
          Submitted at{" "}
          {new Date(latestSubmission.createAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="bg-card border flex-1 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <Clock size={16} />
            <span>Runtime</span>
          </div>
          <p className="text-foreground text-left">{avgTime.toFixed(3)}ms</p>
        </div>

        <div className="bg-card border flex-1 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <MemoryStick size={16} />
            <span>Memory</span>
          </div>
          <p className="text-foreground  text-left">{avgMemory.toFixed(0)}KB</p>
        </div>
      </div>

      {/* All Submissions Section */}
      <h2 className="text-foreground text-lg font-medium mb-6 text-left">
        All Submissions
      </h2>
    </div>
  );
};

export default SubmissionResults;
