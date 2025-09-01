import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronDown,
  ChevronUp,
  Plus,
  BookOpen,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  MoreVertical,
  ExternalLink,
  Loader,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePlaylistStore } from "@/store/usePlaylistStore"

// Utility functions
const getDifficultyColor = (difficulty) => {
  const colors = {
    EASY: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    MEDIUM:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    HARD: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }
  return colors[difficulty?.toUpperCase()] || "text-gray-600 bg-gray-50 border-gray-200"
}

// const getStatusIcon = (status) => {
//   const icons = {
//     solved: <CheckCircle className="h-4 w-4 text-green-600" />,
//     attempted: <AlertCircle className="h-4 w-4 text-yellow-600" />,
//     unsolved: <XCircle className="h-4 w-4 text-gray-400" />,
//   }
//   return icons[status] || icons.unsolved
// }

const isSolved = (problem) => {
  try {
    if (!problem) return false
    if (Array.isArray(problem?.userId) && problem.userId.length > 0) {
      console.log(problem.userId)
      return true
    }
    if (typeof problem?.status === "string") {
      return problem.status.toLowerCase() === "solved"
    }
    return false
  } catch {
    return false
  }
}

const calculateProgress = (problems) => {
  if (!problems?.length) return 0
  const solvedCount = problems.filter((p) => {
    const prob = p?.problem || p
    return isSolved(prob)
  }).length
  return Math.round((solvedCount / problems.length) * 100)
}

// Fixed Stats card component
const StatsCard = ({ title, value, icon: Icon, borderColor }) => {
  // Safely extract and convert border color to text color
  const getIconColor = (borderColor) => {
    if (!borderColor) return "text-gray-500"

    const parts = borderColor.split(" ")
    const borderColorClass = parts.find((part) => part.startsWith("border-l-"))

    if (borderColorClass) {
      return borderColorClass.replace("border-l-", "text-")
    }

    // Fallback: try to extract color from any border class
    const colorMatch = borderColor.match(/border-l?-(\w+-\d+)/)
    return colorMatch ? `text-${colorMatch[1]}` : "text-gray-500"
  }

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${getIconColor(borderColor)}`} />
        </div>
      </CardContent>
    </Card>
  )
}

// Problem item component
const ProblemItem = ({ problem, playlistId, onSolve, onRemove, isRemoving }) => {
  const solved = isSolved(problem)
  const normalizedStatus = solved
    ? "solved"
    : typeof problem?.status === "string"
      ? problem.status.toLowerCase()
      : "unsolved"

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
        isRemoving ? "opacity-50 bg-muted/30" : "bg-muted/50 hover:bg-muted hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* {getStatusIcon(normalizedStatus)} */}
        <div className="flex-1">
          <p
            className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            onClick={() => onSolve(problem)}
            title="Click to solve this problem"
          >
            {problem.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </Badge>
            <div className="flex gap-1">
              {problem.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {problem.tags?.length > 2 && (
                <Badge variant="secondary" className="text-xs" title={problem.tags.slice(2).join(", ")}>
                  +{problem.tags.length - 2}
                </Badge>
              )}
            </div>
            {normalizedStatus === "solved" && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                ✓ Solved
              </Badge>
            )}
            {normalizedStatus === "attempted" && (
              <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                ⚡ Attempted
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSolve(problem)}
          className="hover:bg-primary cursor-pointer transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Solve
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive transition-colors cursor-pointer bg-transparent"
              disabled={isRemoving}
            >
              {isRemoving ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Problem</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove "{problem.title}" from this playlist? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onRemove(playlistId, problem.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default function PlaylistPage() {
  const {
    playlist,
    currentPlaylist,
    isLoading,
    error,
    createPlaylist,
    getAllPlaylists,
    getPlaylistDetails,
    removeProblemFromPlaylist,
    deletePlaylist,
  } = usePlaylistStore()

  const [expandedPlaylist, setExpandedPlaylist] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" })
  const [deletingPlaylistId, setDeletingPlaylistId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [removingProblemId, setRemovingProblemId] = useState(null)

  const navigate = useNavigate()

  const memoizedGetAllPlaylists = useCallback(getAllPlaylists, [getAllPlaylists])

  useEffect(() => {
    memoizedGetAllPlaylists()
  }, [memoizedGetAllPlaylists])

  useEffect(() => {
    if (expandedPlaylist && (!currentPlaylist || currentPlaylist.id !== expandedPlaylist)) {
      getPlaylistDetails(expandedPlaylist)
    }
  }, [expandedPlaylist, currentPlaylist, getPlaylistDetails])

  useEffect(() => {
    if (expandedPlaylist && playlist.length > 0 && !playlist.find((p) => p.id === expandedPlaylist)) {
      setExpandedPlaylist(null)
    }
  }, [playlist.length, expandedPlaylist])

  const toggleExpand = async (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId)
  }

  const validateForm = () => {
    const errors = {}
    if (!newPlaylist.name?.trim()) {
      errors.name = "Playlist name is required"
    } else if (newPlaylist.name.trim().length < 3) {
      errors.name = "Playlist name must be at least 3 characters long"
    }
    if (newPlaylist.description?.length > 500) {
      errors.description = "Description must be less than 500 characters"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreatePlaylist = async () => {
    if (!validateForm()) return

    setIsCreating(true)
    try {
      await createPlaylist({
        name: newPlaylist.name.trim(),
        description: newPlaylist.description.trim(),
      })

      setNewPlaylist({ name: "", description: "" })
      setFormErrors({})
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create playlist:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    try {
      setDeletingPlaylistId(playlistId)
      if (expandedPlaylist === playlistId) setExpandedPlaylist(null)
      await deletePlaylist(playlistId)
    } catch (error) {
      console.error("Failed to delete playlist:", error)
    } finally {
      setDeletingPlaylistId(null)
    }
  }

  const handleDeleteProblem = async (playlistId, problemId) => {
    setRemovingProblemId(problemId)
    try {
      await removeProblemFromPlaylist(playlistId, [problemId])
    } catch (error) {
      console.error("Failed to remove problem:", error)
    } finally {
      setRemovingProblemId(null)
    }
  }

  const handleSolveProblem = (problem) => {
    try {
      const route = `/problem/${problem.id}`
      navigate(route, {
        state: { problem, returnTo: "/playlists" },
      })
    } catch (error) {
      console.error("Navigation failed:", error)
      window.open(`/problems/${problem.id}`, "_blank")
    }
  }

  const handleDialogClose = (open) => {
    if (!open && !isCreating) {
      setIsCreateDialogOpen(false)
      setNewPlaylist({ name: "", description: "" })
      setFormErrors({})
    }
  }

  const stats = {
    totalProblems: playlist.reduce((acc, pl) => acc + (pl.problems?.length || 0), 0),
    avgProgress:
      playlist.length > 0
        ? Math.round(playlist.reduce((acc, pl) => acc + calculateProgress(pl.problems), 0) / playlist.length)
        : 0,
  }

  if (isLoading && playlist.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
        <Loader className="size-10 animate-spin" />
          <span>Loading playlists...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Playlists</h1>
            <p className="text-muted-foreground text-lg">Organize and track your coding practice</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || deletingPlaylistId}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create New Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>Create a custom playlist to organize your coding problems</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Playlist Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newPlaylist.name}
                    onChange={(e) => {
                      setNewPlaylist({ ...newPlaylist, name: e.target.value })
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined })
                    }}
                    placeholder="Enter playlist name"
                    className={formErrors.name ? "border-red-500" : ""}
                    disabled={isCreating}
                  />
                  {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlaylist.description}
                    onChange={(e) => {
                      setNewPlaylist({
                        ...newPlaylist,
                        description: e.target.value,
                      })
                      if (formErrors.description)
                        setFormErrors({
                          ...formErrors,
                          description: undefined,
                        })
                    }}
                    placeholder="Describe your playlist (optional)"
                    rows={3}
                    className={formErrors.description ? "border-red-500" : ""}
                    disabled={isCreating}
                    maxLength={500}
                  />
                  {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                  <p className="text-xs text-muted-foreground">{newPlaylist.description.length}/500 characters</p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => handleDialogClose(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlaylist} disabled={isCreating || !newPlaylist.name.trim()}>
                    {isCreating ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Playlist
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Total Playlists" value={playlist.length} icon={BookOpen} borderColor="border-l-primary border-t-primary border-3" />
          <StatsCard
            title="Total Problems"
            value={stats.totalProblems}
            icon={Target}
            borderColor="border-l-green-500 border-t-green-500 border-3"
          />
          <StatsCard
            title="Avg Progress"
            value={`${stats.avgProgress}%`}
            icon={Trophy}
            borderColor="border-l-blue-500 border-t-blue-500 border-3"
          />
          <StatsCard title="Active Streaks" value={7} icon={Clock} borderColor="border-l-orange-500 border-t-orange-500 border-3" />
        </div>

        {/* Playlists Grid */}
        <div className="space-y-6">
          {playlist.map((playlistItem) => {
            const progress = calculateProgress(playlistItem.problems)
            const isExpanded = expandedPlaylist === playlistItem.id
            const displayProblems =
              isExpanded && currentPlaylist?.id === playlistItem.id
                ? currentPlaylist.problems
                : playlistItem.problems || []
            const isBeingDeleted = deletingPlaylistId === playlistItem.id

            return (
              <Card
                key={playlistItem.id}
                className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${
                  isBeingDeleted ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">{playlistItem.name}</CardTitle>
                        {playlistItem.description && (
                          <CardDescription className="text-muted-foreground mt-1">
                            {playlistItem.description}
                          </CardDescription>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            Playlist
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {playlistItem.problems?.length || 0} problems
                          </span>
                          {playlistItem.createdAt && (
                            <span className="text-sm text-muted-foreground">
                              Created {new Date(playlistItem.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isBeingDeleted || isLoading}>
                            {isBeingDeleted ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => !isBeingDeleted && handleDeletePlaylist(playlistItem.id)}
                            disabled={isBeingDeleted}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            Delete Playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(playlistItem.id)}
                        disabled={isBeingDeleted || isLoading}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Progress</span>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <h4 className="font-medium text-foreground mb-3">Problems in this playlist:</h4>
                        {isLoading && currentPlaylist?.id !== playlistItem.id ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader className="h-6 w-6 animate-spin" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {displayProblems.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                No problems in this playlist yet
                              </div>
                            ) : (
                              displayProblems.map((problemItem) => {
                                const problem = problemItem.problem || problemItem
                                return (
                                  <ProblemItem
                                    key={problem.id}
                                    problem={problem}
                                    playlistId={playlistItem.id}
                                    onSolve={handleSolveProblem}
                                    onRemove={handleDeleteProblem}
                                    isRemoving={removingProblemId === problem.id}
                                  />
                                )
                              })
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {playlist.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first playlist to start organizing your coding problems
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Playlist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
