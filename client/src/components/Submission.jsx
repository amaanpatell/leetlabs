import React, { useState } from "react";
import { Clock, MemoryStick, Terminal } from "lucide-react";
import { Editor } from "@monaco-editor/react";

const SubmissionResults = ({ submission }) => {
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
      parseFloat(m.split("KB")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split("S")[0])
    );
    if (timeArray.length === 0) return 0;
    return (
      (timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length) * 1000
    ); // Convert to ms
  };

  // Helper function to get source code from the object structure
  const getSourceCode = (sourceCodeObj, language) => {
    if (typeof sourceCodeObj === "string") {
      return sourceCodeObj;
    }
    if (sourceCodeObj && typeof sourceCodeObj === "object") {
      return (
        sourceCodeObj[language] || sourceCodeObj[language.toUpperCase()] || ""
      );
    }
    return "";
  };

  // No submission state
  if (!submission) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-600">No submission data available</div>
      </div>
    );
  }

  // Use the selected submission
  const avgMemory = calculateAverageMemory(submission.memory);
  const avgTime = calculateAverageTime(submission.time);
  const sourceCode = getSourceCode(submission.sourceCode, submission.language);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background text-foreground">
      <h2 className="text-foreground text-lg font-medium mb-4 text-left">
        Submission Details
      </h2>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`font-medium text-base ${
              submission.status === "Accepted"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {submission.status}
          </span>
        </div>
        <p className="text-muted-foreground text-sm text-left">
          Submitted at {new Date(submission.createAt).toLocaleDateString()}
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
          <p className="text-foreground text-left">{avgMemory.toFixed(0)}KB</p>
        </div>
      </div>

      <div className=" rounded-lg overflow-hidden">
        <div className="flex border-b bg-card">
          <div className="flex items-center px-4 py-2">
            <Terminal className="w-4 h-4 mr-2" />
            Code Editor
          </div>
        </div>

        {/* Code Display */}
        <div className="mb-7">
          <Editor
            height="400px"
            language={submission.language.toLowerCase()}
            theme="vs-dark"
            value={sourceCode}
            className="overflow-hidden"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: true,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
