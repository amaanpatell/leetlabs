import React, { useState } from "react";
import { ArrowLeft, Clock, MemoryStick } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubmissionResults from "./Submission";

const SubmissionsList = ({ submissions }) => {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    // If a submission is selected, show the results
    if (selectedSubmission) {
      return (
        <div className="flex h-full flex-col overflow-y-auto bg-background text-foreground">
          <div>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to submissions
            </button>
            <SubmissionResults submission={selectedSubmission} />
          </div>
        </div>
      );
    }

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
  const latestSubmission = submissions[0];
  const avgMemory = calculateAverageMemory(latestSubmission.memory);
  const avgTime = calculateAverageTime(latestSubmission.time);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background text-foreground">
      <div>
        {/* Last Submission Section */}
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
            <p className="text-foreground  text-left">
              {avgMemory.toFixed(0)}KB
            </p>
          </div>
        </div>

        {/* All Submissions Section */}
        <h2 className="text-foreground text-lg font-medium mb-6 text-left">
          All Submissions
        </h2>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted ">
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Language</TableHead>
                <TableHead className="text-center">Runtime</TableHead>
                <TableHead className="text-center">Memory</TableHead>
                <TableHead className="text-center">Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => {
                const submissionAvgMemory = calculateAverageMemory(
                  submission.memory
                );
                const submissionAvgTime = calculateAverageTime(submission.time);

                return (
                  <TableRow
                    key={submission.id || index}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <TableCell className="text-left">
                      <span
                        className={`font-medium text-sm ${
                          submission.status === "Accepted"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground text-sm">
                      {submission.language.charAt(0).toUpperCase() +
                        submission.language.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell className="text-foreground text-sm">
                      {submissionAvgTime.toFixed(3)}ms
                    </TableCell>
                    <TableCell className="text-foreground text-sm">
                      {submissionAvgMemory.toFixed(0)}kb
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(submission.createAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsList;
