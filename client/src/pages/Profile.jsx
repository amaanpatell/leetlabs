import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Trophy, Target, Code, CheckCircle, Clock, Star, TrendingUp, Award, Flame, BookOpen, Loader } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useSubmissionStore } from "@/store/useSubmissionStore"
import { useState, useEffect } from "react"
import { useProblemStore } from "@/store/useProblemStore"

const ProfilePage = () => {
  const { authUser } = useAuthStore()
  const { submissions, getAllSubmissions, isLoading } = useSubmissionStore()
  const { problems, getAllProblems } = useProblemStore()
  
  const [userData, setUserData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    role: authUser?.role || "user",
    currentStreak: 0,
    ranking: 12847,
    reputation: 1250,
  });

  // Create a mapping of problem IDs to problem titles
  const [problemTitleMap, setProblemTitleMap] = useState({});

  // Fetch submissions and problems when component mounts
  useEffect(() => {
    getAllSubmissions()
    getAllProblems() // Fetch all problems to get the titles
  }, [getAllSubmissions, getAllProblems])

  // Create problem title mapping when problems are loaded
  useEffect(() => {
    if (problems && problems.length > 0) {
      const titleMap = {}
      problems.forEach(problem => {
        titleMap[problem.id] = problem.title
      })
      setProblemTitleMap(titleMap)
    }
  }, [problems])

  // Calculate stats from real submission data
  const calculateUserStats = () => {
    if (!submissions || submissions.length === 0) {
      return {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSubmissions: 0,
        acceptanceRate: 0,
        currentStreak: 0,
        maxStreak: 0,
        ranking: userData.ranking,
        reputation: userData.reputation,
      }
    }

    const totalSubmissions = submissions.length
    const acceptedSubmissions = submissions.filter(sub => sub.status === "Accepted")
    const totalSolved = acceptedSubmissions.length
    const acceptanceRate = totalSubmissions > 0 ? (totalSolved / totalSubmissions) * 100 : 0

    // Group by problem ID to get unique solved problems
    const uniqueProblems = new Set(acceptedSubmissions.map(sub => sub.problemId))
    const actualSolved = uniqueProblems.size

    return {
      totalSolved: actualSolved,
      easySolved: Math.floor(actualSolved * 0.4), 
      mediumSolved: Math.floor(actualSolved * 0.5),
      hardSolved: Math.floor(actualSolved * 0.1),
      totalSubmissions,
      acceptanceRate: Math.round(acceptanceRate),
      currentStreak: userData.currentStreak,
      maxStreak: 32,
      ranking: userData.ranking,
      reputation: userData.reputation,
    }
  }

  const userStats = calculateUserStats()

  // Transform real submissions for display
  const getRecentSubmissions = () => {
    if (!submissions || submissions.length === 0) return []
    
    // Sort by creation date (most recent first) and take first 5
    return submissions
      .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
      .slice(0, 5)
      .map(submission => ({
        id: submission.id,
        title: getSubmissionTitle(submission.problemId),
        status: submission.status,
        time: getTimeAgo(submission.createAt),
        language: submission.language.charAt(0) + submission.language.slice(1).toLowerCase()
      }))
  }

  // Helper function to get problem title using the mapping
  const getSubmissionTitle = (problemId) => {
    // Use the problem title mapping, fallback to "Unknown Problem" if not found
    return problemTitleMap[problemId] || "Unknown Problem"
  }

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now - date
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const recentSubmissions = getRecentSubmissions()

  // Update achievements based on real data
  const getAchievements = () => {
    const solvedCount = userStats.totalSolved
    const submissionCount = userStats.totalSubmissions
    
    return [
      { 
        id: 1, 
        title: "First Solve", 
        description: "Solved your first problem", 
        icon: "🎯", 
        earned: solvedCount > 0 
      },
      { 
        id: 2, 
        title: "Getting Started", 
        description: "Made 5 submissions", 
        icon: "⚡", 
        earned: submissionCount >= 5 
      },
      { 
        id: 3, 
        title: "Problem Solver", 
        description: "Solved 10 problems", 
        icon: "🔥", 
        earned: solvedCount >= 10 
      },
      { 
        id: 4, 
        title: "Persistent Coder", 
        description: "Made 20 submissions", 
        icon: "💪", 
        earned: submissionCount >= 20 
      },
      { 
        id: 5, 
        title: "JavaScript Master", 
        description: "All submissions in JavaScript", 
        icon: "🌟", 
        earned: submissions.length > 0 && submissions.every(sub => sub.language === "JAVASCRIPT")
      },
      { 
        id: 6, 
        title: "High Achiever", 
        description: "80%+ acceptance rate", 
        icon: "🏆", 
        earned: userStats.acceptanceRate >= 80 
      },
    ]
  }

  const achievements = getAchievements()

  // Calculate skill progress based on submissions
  const getSkillProgress = () => {
    if (!submissions || submissions.length === 0) {
      return [
        { skill: "Problem Solving", progress: 0, problems: 0 },
        { skill: "JavaScript", progress: 0, problems: 0 },
        { skill: "Code Quality", progress: 0, problems: 0 },
        { skill: "Algorithms", progress: 0, problems: 0 },
        { skill: "Data Structures", progress: 0, problems: 0 },
        { skill: "Debugging", progress: 0, problems: 0 },
      ]
    }

    const stats = userStats
    const acceptedSubmissions = submissions.filter(s => s.status === "Accepted")
    
    return [
      { skill: "Problem Solving", progress: Math.min(100, (stats.totalSolved / 20) * 100), problems: stats.totalSolved },
      { skill: "JavaScript", progress: submissions.length > 0 ? 85 : 0, problems: acceptedSubmissions.length },
      { skill: "Code Quality", progress: stats.acceptanceRate, problems: stats.totalSubmissions },
      { skill: "Algorithms", progress: Math.min(100, (stats.totalSolved / 15) * 100), problems: stats.totalSolved },
      { skill: "Data Structures", progress: Math.min(100, (stats.totalSolved / 10) * 100), problems: stats.totalSolved },
      { skill: "Debugging", progress: Math.max(20, Math.min(100, 100 - (stats.totalSubmissions - stats.totalSolved) * 10)), problems: stats.totalSubmissions - stats.totalSolved },
    ]
  }

  const skillProgress = getSkillProgress()

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "Wrong Answer":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case "Time Limit Exceeded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-8">
        {/* Header Section */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="text-xl font-semibold bg-muted">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userData.name}</h1>
                  <p className="text-muted-foreground text-lg">Software Engineer • Competitive Programmer</p>
                  <p className="text-sm text-muted-foreground mt-1">{userData.email} &nbsp; <Badge>{userData.role}</Badge></p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-medium">Rank #{userData.ranking.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="font-medium">{userData.reputation} Reputation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{userData.currentStreak} Day Streak</span>
                  </div>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 cursor-not-allowed">
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary pb-2">{userStats.totalSolved}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary pb-2">{userStats.totalSubmissions}</div>
                <div className="text-sm text-muted-foreground">Total Submissions</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary pb-2">{userStats.acceptanceRate}%</div>
                <div className="text-sm text-muted-foreground">Acceptance Rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{submissions.filter(s => s.language === "JAVASCRIPT").length}</div>
                <div className="text-sm text-muted-foreground">JavaScript Solutions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{submission.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{submission.language}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{submission.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No submissions yet</p>
                    <p className="text-sm">Start solving problems to see your submissions here!</p>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Submissions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                      achievement.earned
                        ? "border-primary bg-primary/5 hover:bg-primary/10"
                        : "border-border bg-muted/30 opacity-60 hover:opacity-80"
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium text-sm text-foreground">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skill Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillProgress.map((skill, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{skill.skill}</span>
                    <span className="text-sm text-muted-foreground">{skill.problems} problems</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={skill.progress} className="h-3" />
                    <div className="text-right text-xs text-muted-foreground">{Math.round(skill.progress)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage