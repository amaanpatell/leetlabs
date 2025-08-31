import { useState, useEffect, useCallback } from "react"
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
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePlaylistStore } from "@/store/usePlaylistStore"

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toUpperCase()) {
    case "EASY":
      return "text-green-600 bg-green-50 border-green-200"
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "HARD":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "solved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "attempted":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "unsolved":
      return <XCircle className="h-4 w-4 text-gray-400" />
    default:
      return <XCircle className="h-4 w-4 text-gray-400" />
  }
}

const getCategoryIcon = (category) => {
  switch (category) {
    case "Challenge":
      return <Target className="h-5 w-5" />
    case "Company":
      return <Trophy className="h-5 w-5" />
    case "Topic":
      return <BookOpen className="h-5 w-5" />
    default:
      return <BookOpen className="h-5 w-5" />
  }
}

const calculateProgress = (problems) => {
  if (!problems || problems.length === 0) return 0
  const solvedCount = problems.filter((p) => p.status === "solved").length
  return Math.round((solvedCount / problems.length) * 100)
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
    addProblemToPlaylist,
    removeProblemFromPlaylist,
    deletePlaylist
  } = usePlaylistStore()

  const [expandedPlaylist, setExpandedPlaylist] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" })
  const [deletingPlaylistId, setDeletingPlaylistId] = useState(null)

  // Memoize the callback to prevent infinite re-renders
  const memoizedGetAllPlaylists = useCallback(() => {
    getAllPlaylists()
  }, [getAllPlaylists])

  // Only fetch playlists once on mount
  useEffect(() => {
    memoizedGetAllPlaylists()
  }, [])

  // Only fetch details when expanded playlist changes and we don't have current data
  useEffect(() => {
    if (expandedPlaylist && (!currentPlaylist || currentPlaylist.id !== expandedPlaylist)) {
      getPlaylistDetails(expandedPlaylist)
    }
  }, [expandedPlaylist])

  // Reset expanded playlist if it no longer exists
  useEffect(() => {
    if (expandedPlaylist && playlist.length > 0 && !playlist.find(p => p.id === expandedPlaylist)) {
      setExpandedPlaylist(null)
    }
  }, [playlist.length, expandedPlaylist])

  const toggleExpand = async (playlistId) => {
    if (expandedPlaylist === playlistId) {
      setExpandedPlaylist(null)
    } else {
      setExpandedPlaylist(playlistId)
      getPlaylistDetails(playlistId).catch(console.error)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) return

    try {
      await createPlaylist(newPlaylist)
      setIsCreateDialogOpen(false)
      setNewPlaylist({ name: "", description: "" })
    } catch (error) {
      console.error("Failed to create playlist:", error)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    try {
      setDeletingPlaylistId(playlistId)
      
      // Clear expanded state immediately
      if (expandedPlaylist === playlistId) {
        setExpandedPlaylist(null)
      }
      
      await deletePlaylist(playlistId)
      
    } catch (error) {
      console.error("Failed to delete playlist:", error)
    } finally {
      setDeletingPlaylistId(null)
    }
  }

  const handleDeleteProblem = async (playlistId, problemId) => {
    try {
      await removeProblemFromPlaylist(playlistId, problemId)
      if (expandedPlaylist === playlistId) {
        await getPlaylistDetails(playlistId)
      }
    } catch (error) {
      console.error("Failed to remove problem:", error)
    }
  }

  const totalProblems = playlist.reduce((acc, pl) => acc + (pl.problems?.length || 0), 0)
  const avgProgress =
    playlist.length > 0
      ? Math.round(playlist.reduce((acc, pl) => acc + calculateProgress(pl.problems), 0) / playlist.length)
      : 0

  if (isLoading && playlist.length === 0 && !deletingPlaylistId) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
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

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || deletingPlaylistId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>Create a custom playlist to organize your coding problems</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Playlist Name</Label>
                  <Input
                    id="name"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    placeholder="Enter playlist name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                    placeholder="Describe your playlist"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePlaylist} 
                    disabled={isLoading || !newPlaylist.name.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Playlist
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Playlists</p>
                  <p className="text-3xl font-bold text-foreground">{playlist.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Problems</p>
                  <p className="text-3xl font-bold text-foreground">{totalProblems}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-3xl font-bold text-foreground">{avgProgress}%</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Streaks</p>
                  <p className="text-3xl font-bold text-foreground">7</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
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
                  isBeingDeleted ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">{getCategoryIcon("Topic")}</div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">{playlistItem.name}</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
                          {playlistItem.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            Playlist
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {playlistItem.problems?.length || 0} problems
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Created {new Date(playlistItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={isBeingDeleted || isLoading}
                          >
                            {isBeingDeleted ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (!isBeingDeleted) {
                                handleDeletePlaylist(playlistItem.id)
                              }
                            }}
                            disabled={isBeingDeleted}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(playlistItem.id)}
                        className="shrink-0"
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
                            <Loader2 className="h-6 w-6 animate-spin" />
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
                                  <div
                                    key={problem.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      {getStatusIcon("unsolved")}
                                      <div>
                                        <p className="font-medium text-foreground">{problem.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${getDifficultyColor(problem.difficulty)}`}
                                          >
                                            {problem.difficulty}
                                          </Badge>
                                          <div className="flex gap-1">
                                            {problem.tags?.slice(0, 2).map((tag) => (
                                              <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                            {problem.tags?.length > 2 && (
                                              <Badge variant="secondary" className="text-xs">
                                                +{problem.tags.length - 2}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm">
                                        Solve
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Remove Problem</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to remove "{problem.title}" from this playlist? This
                                              action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteProblem(playlistItem.id, problem.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Remove
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
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