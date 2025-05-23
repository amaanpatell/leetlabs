import { db } from "../utils/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const createPlayList = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

export const getPlayAllListDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

export const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found", Error);
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemId } = req.body;

  if (!problemId) {
    throw new ApiError(400, "Missing problemId");
  }

  const problemInPlaylist = await db.problemInPlaylist.create({
    data: {
      playListId: playlistId,
      problemId,
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        problemInPlaylist,
        "Problem added to playlist successfully",
      ),
    );
});

export const deletePlayList = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const deletedPlaylist = await db.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"),
    );
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing problemIds" });
  }
  // Only delete given problemIds not all

  const deletedProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playListId: playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedProblem,
        "Problem removed from playlist successfully",
      ),
    );
});
