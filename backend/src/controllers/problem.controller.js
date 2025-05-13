import { db } from "../utils/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../utils/judge0.utils.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not allowed to create a problem");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);
    if (!languageId) {
      throw new ApiError(400, `${language} Language is not supported`);
    }

    const submissions = testCases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log("Result-----", result);

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`,
        );
      }
    }
  }

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, newProblem, "Problem created successfully"));
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();
  if (!problems) {
    throw new ApiError(404, "No problems found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, problems, "Problems Fetched Successfully"));
});

export const getProblemsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem fetched successfully"));
});

export const updateProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingProblem = await db.problem.findUnique({
    where: { id },
  });

  if (!existingProblem) {
    throw new ApiError(404, "Problem not found");
  }

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);
    if (!languageId) {
      throw new ApiError(400, `${language} Language is not supported`);
    }

    const submissions = testCases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log("Result-----", result);

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`,
        );
      }
    }
  }

  const newProblem = await db.problem.update({
    where: { id },
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    },
  });
  res
    .status(201)
    .json(new ApiResponse(201, newProblem, "Problem created successfully"));
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await db.problem.delete({
    where: { id },
  });
  res.status(200).json(new ApiResponse(200, null, "Problem deleted Successfully"));
});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});
