import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Terminal,
  Code2,
  Clock,
  Users,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Share,
  Tag,
  Building,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Editor } from "@monaco-editor/react";

import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../utils/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "@/components/SubmissionList";
import Timer from "@/components/Timer";

// Expandable Section Component
const ExpandableSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-border p-4 bg-background">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ProblemPage() {
  // State management
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const { executeCode, submission, isExecuting } = useExecutionStore();
  const [selectedTest, setSelectedTest] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const { clearSubmission } = useExecutionStore();

  // Simulate API calls
  useEffect(() => {
    if (id) {
      // Reset states when problem ID changes
      setTestCases([]);
      setSelectedTest(0);
      // Clear previous submission results
      if (clearSubmission) {
        clearSubmission();
      }
      getProblemById(id);
      getSubmissionCountForProblem(id);
    }
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage.toUpperCase()] ||
          submission?.sourceCode ||
          ""
      );
      // Initialize test cases from problem data - RESET execution results
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
          expected: tc.output, // Add expected field for consistency
          actualOutput: undefined, // Reset execution results
          passed: undefined, // Reset pass/fail status
          status: undefined, // Reset status
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  // NEW: Update test cases when execution results are available
  useEffect(() => {
    if (submission && submission.TestCaseResult && problem?.testCases) {
      const updatedTestCases = problem.testCases.map((tc, index) => {
        const result = submission.TestCaseResult[index];
        return {
          input: tc.input,
          output: tc.output,
          expected: result?.expected || tc.output,
          actualOutput: result?.stdout || "No output",
          passed: result?.passed || false,
          status: result?.status || "Unknown",
        };
      });
      setTestCases(updatedTestCases);
    }
  }, [submission, problem]);

  // Reset test cases when problem changes
  useEffect(() => {
    if (problem) {
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
          expected: tc.output,
          actualOutput: undefined,
          passed: undefined,
          status: undefined,
        })) || []
      );
    }
  }, [problem?.id]); // Only trigger when problem ID changes

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  // Handle language change
  const handleLanguageChange = (value) => {
    const lang = value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  // Handle code execution
  const handleRunCode = (e) => {
    e.preventDefault();

    // Reset test cases to initial state before execution
    if (problem?.testCases) {
      setTestCases(
        problem.testCases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          expected: tc.output,
          actualOutput: undefined,
          passed: undefined,
          status: "Running...",
        }))
      );
    }

    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const displayTestCases =
    testCases && testCases.length > 0 ? testCases : problem?.testCases || [];

  if (!displayTestCases || displayTestCases.length === 0) {
    return (
      <div className="border-t border-border">
        <div className="p-4 text-center text-muted-foreground">
          No test cases available
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            {/* Problem Description */}
            <div>
              <p className="text-foreground leading-relaxed">
                {problem?.description}
              </p>
            </div>

            {/* Examples Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Examples
              </h3>

              {problem?.examples &&
                Object.entries(problem.examples).map(([lang, example], idx) => (
                  <div
                    key={lang}
                    className="border border-border rounded-lg p-4 bg-card space-y-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground mb-2">
                          Input:
                        </div>
                        <div className="bg-muted/50 border border-border p-3 rounded-md font-mono text-sm text-foreground">
                          {example.input}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-foreground mb-2">
                          Output:
                        </div>
                        <div className="bg-muted/50 border border-border p-3 rounded-md font-mono text-sm text-foreground">
                          {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-sm font-semibold text-foreground mb-2">
                            Explanation:
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {example.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Constraints Section */}
            {problem?.constraints && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Constraints:
                </h3>
                <div className="border border-border rounded-lg p-4 bg-card">
                  <div className="bg-muted/50 border border-border p-3 rounded-md font-mono text-sm text-foreground">
                    {problem.constraints}
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Sections */}
            <div className="space-y-4">
              {/* Topics Section - Only render if topics exist */}
              {problem?.topics && problem.topics.length > 0 && (
                <ExpandableSection title="Topics" icon={Tag} defaultExpanded={true}>
                  <div className="flex flex-wrap gap-2">
                    {problem.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-sm"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </ExpandableSection>
              )}

              {/* Companies Section - Only render if companies exist */}
              {problem?.companies && problem.companies.length > 0 && (
                <ExpandableSection title="Companies" icon={Building}>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge
                        key={company}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 text-sm"
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </ExpandableSection>
              )}

              {/* Hints Section - Only render if hints exist */}
              {problem?.hints && (
                <ExpandableSection title="Hints" icon={Lightbulb}>
                  <div className="space-y-3">
                    {Array.isArray(problem.language) ? (
                      problem.language.map((hint, index) => (
                        <div
                          key={index}
                          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-yellow-800 dark:text-yellow-400 text-sm">
                              Hint {index + 1}:
                            </span>
                            <span className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                              {hint}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                        <span className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                          {problem.hints}
                        </span>
                      </div>
                    )}
                  </div>
                </ExpandableSection>
              )}
            </div>

            {/* Additional Information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground leading-relaxed">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                •
              </span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                •
              </span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        );

      case "submissions":
        return (
          <div className="text-center text-muted-foreground py-8">
            No submissions yet
          </div>
          // <SubmissionsList
          //   submissions={submissions}
          //   isLoading={isSubmissionsLoading}
          // />
        );

      case "discussion":
        return (
          <div className="text-center text-muted-foreground py-8">
            No discussions yet
          </div>
        );

      case "hints":
        return (
          <div className="space-y-4">
            {problem?.hints ? (
              <div className="bg-muted p-4 rounded-lg text-foreground">
                {problem.hints}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No hints available
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground nativescrollbar">
      {/* Native browser scrollbar with color-scheme */}

      <style jsx>{`
        .nativescrollbar {
          color-scheme: dark light;
        }
      `}</style>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2  border-b border-border">
        {/* Left side - Back button */}
        <div className="flex items-center">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            <Play className="w-4 h-4 mr-1" />
            {isExecuting ? "Loading..." : "Submit"}
          </Button>
          <Timer />
        </div>
        <div className="flex items-center justify-center gap-3 pr-2">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 -mr-4">
            🔥 5
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 -mr-4"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            title="Copy problem link"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(93vh-60px)]">
        {/* Left Panel */}
        <div className="w-1/2 border-slate-700 overflow-auto">
          {/* Problem Navigation */}
          <div className="flex gap-1 p-2 ">
            {/* ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80" */}

            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "description"
                  ? "dark:text-slate-100 dark:bg-slate-700 bg-primary text-primary-foreground"
                  : "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 "
              }`}
              onClick={() => setActiveTab("description")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Description
            </Button>
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "submissions"
                  ? "dark:text-slate-100 dark:bg-slate-700 bg-primary text-primary-foreground"
                  : "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 "
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Submissions
            </Button>
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "discussion"
                  ? "dark:text-slate-100 dark:bg-slate-700 bg-primary text-primary-foreground"
                  : "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 "
              }`}
              onClick={() => setActiveTab("discussion")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussion
            </Button>
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "hints"
                  ? "dark:text-slate-100 dark:bg-slate-700 bg-primary text-primary-foreground"
                  : "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 "
              }`}
              onClick={() => setActiveTab("hints")}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Hints
            </Button>
          </div>

          <div className="px-6 pt-6 pb">
            {/* Problem Title and Tags */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>

              {/* Difficulty and Tags Row */}
              <div className="flex items-center gap-3 mb-6">
                <Badge
                  className={`${
                    problem.difficulty === "EASY"
                      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      : problem.difficulty === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                      : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  } font-medium px-2 py-1`}
                >
                  {problem.difficulty}
                </Badge>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col h-full">
          {/* Code Editor Header */}
          <div className="flex border-b border-border py-1 flex-shrink-0">
            <Button
              variant="ghost"
              className="flex-1 justify-start text-foreground hover:bg-base-200"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Code Editor
            </Button>

            <div className="flex items-center px-3 gap-2">
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(problem.codeSnippets || {}).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() +
                        lang.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Code Editor */}
          <div className={`${isExpanded ? "flex-1" : "flex-1"} min-h-0`}>
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Test Cases Section */}
          <div
            className={`px-2 border-t border-border flex flex-col ${
              isExpanded ? "h-70" : "h-auto"
            } flex-shrink-0`}
          >
            {/* Toggle Header */}
            <div
              className="flex justify-center items-center py-1.5 cursor-pointer text-foreground hover:text-muted-foreground transition-all bg-background border-b border-border"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </div>

            {/* Expandable Content */}
            {isExpanded && (
              <div className="flex-1  flex flex-col min-h-0">
                {/* Test Case Tabs */}
                <div className="flex gap-2 py-3 px-6 flex-wrap bg-card border-b border-border">
                  {displayTestCases.map((testCase, index) => (
                    <Button
                      key={index}
                      variant={selectedTest === index ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSelectedTest(index)}
                      className={`px-3 py-1 text-sm font-medium transition cursor-pointer relative ${
                        selectedTest === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Test {index + 1}
                      {/* Status indicator */}
                      {testCase.passed !== undefined && (
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            testCase.passed ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                    </Button>
                  ))}
                </div>

                {/* Test Case Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-card p-6 space-y-4">
                  {displayTestCases[selectedTest] && (
                    <>
                      {/* Input Section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Input
                        </Label>
                        <Input
                          readOnly
                          className="w-full bg-muted text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none font-mono text-sm"
                          type="text"
                          value={displayTestCases[selectedTest].input || ""}
                        />
                      </div>

                      {/* Expected Output Section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">
                          Expected Output
                        </Label>
                        <Input
                          readOnly
                          className="w-full bg-muted text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none font-mono text-sm"
                          type="text"
                          value={
                            displayTestCases[selectedTest].output ||
                            displayTestCases[selectedTest].expected ||
                            ""
                          }
                        />
                      </div>

                      {/* Actual Output Section (if execution results are available) */}
                      {displayTestCases[selectedTest].actualOutput !==
                        undefined && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">
                            Your Output
                          </Label>
                          <Input
                            readOnly
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none font-mono text-sm ${
                              displayTestCases[selectedTest].passed
                                ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                            }`}
                            type="text"
                            value={
                              displayTestCases[selectedTest].actualOutput || ""
                            }
                          />
                        </div>
                      )}

                      {/* Status indicator for execution results */}
                      {displayTestCases[selectedTest].passed !== undefined && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              displayTestCases[selectedTest].passed
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`text-sm font-medium ${
                              displayTestCases[selectedTest].passed
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {displayTestCases[selectedTest].passed
                              ? "Passed"
                              : "Failed"}
                          </span>
                          {displayTestCases[selectedTest].status && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({displayTestCases[selectedTest].status})
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}