import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Eye,
  Building2,
  Calendar,
  Target,
  Zap,
  Award,
  Code,
  TrendingUp,
  Clock,
  BookOpen,
  Flame,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/store/useProblemStore";
import { useAuthStore } from "@/store/useAuthStore";
import { IconPlaylist, IconPlaylistAdd } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useSubmissionStore } from "@/store/useSubmissionStore";

const Dashboard = () => {
  const { authUser } = useAuthStore();
  const { problems, getAllProblems, solvedProblems, getSolvedProblemsByUser } =
    useProblemStore();
  const { submissions, getAllSubmissions } = useSubmissionStore();

  // Use a state variable for user data to trigger re-renders
  const [userData, setUserData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    role: authUser?.role || "user",
    avatar: "/diverse-user-avatars.png",
    totalProblems: 0,
    totalSubmissions: 342,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    easyTotal: 150,
    mediumTotal: 120,
    hardTotal: 80,
    streak: 15,
    rank: 2847,
    contestRating: 1654,
  });

  // Fetch solved problems on component mount
  useEffect(() => {
    getSolvedProblemsByUser();
    getAllProblems();
    getAllSubmissions();
  }, [getSolvedProblemsByUser, getAllProblems, getAllSubmissions]);

  // Update user data whenever solvedProblems changes
  useEffect(() => {
    if (solvedProblems) {
      const easySolved = solvedProblems.filter((p) => p.difficulty === "EASY").length;
      const mediumSolved = solvedProblems.filter((p) => p.difficulty === "MEDIUM").length;
      const hardSolved = solvedProblems.filter((p) => p.difficulty === "HARD").length;

      // Calculate total problems by adding easy, medium, and hard problems
      const totalEasyProblem = problems.filter((p) => p.difficulty === "EASY").length;
      const totalMediumProblem = problems.filter((p) => p.difficulty === "MEDIUM").length;
      const totalHardProblem = problems.filter((p) => p.difficulty === "HARD").length;

      setUserData((prevData) => ({
        ...prevData,
        totalProblems: solvedProblems.length,
        easySolved: easySolved,
        mediumSolved: mediumSolved,
        hardSolved: hardSolved,

        easyTotal: totalEasyProblem,
        mediumTotal: totalMediumProblem,
        hardTotal: totalHardProblem,

        totalSubmissions: submissions.length
      }));
    }
  }, [solvedProblems, problems]);

  return (
    <div>
      <div className="border-b">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-balance">
                Welcome back, {userData.name}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Ready to solve some problems today?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-4 border-t-blue-500 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Problems Solved
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {userData.totalProblems}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-t-chart-2 border-l-chart-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-chart-2">
                    {userData.totalSubmissions}
                  </p>
                </div>
                <Code className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-t-chart-3 border-l-chart-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contest Rating
                  </p>
                  <p className="text-3xl font-bold text-chart-3">
                    {userData.contestRating}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-t-orange-500 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-orange-500">
                    {userData.streak}
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="h-6 w-6" />
              Problem Solving Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Easy Problems */}
              <div className="space-y-4 border-r-2 border-border pr-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-green-600">Easy</h3>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {userData.easySolved}/{userData.easyTotal}
                  </Badge>
                </div>
                <Progress
                  value={(userData.easySolved / userData.easyTotal) * 100}
                  className="h-3 [&>div]:bg-green-500"
                />
                <p className="text-sm text-muted-foreground">
                  {Math.round((userData.easySolved / userData.easyTotal) * 100)}
                  % completed
                </p>
              </div>

              {/* Medium Problems */}
              <div className="space-y-4 border-r-2 border-border pr-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-yellow-600">
                    Medium
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    {userData.mediumSolved}/{userData.mediumTotal}
                  </Badge>
                </div>
                <Progress
                  value={(userData.mediumSolved / userData.mediumTotal) * 100}
                  className="h-3 [&>div]:bg-yellow-500"
                />
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (userData.mediumSolved / userData.mediumTotal) * 100
                  )}
                  % completed
                </p>
              </div>

              {/* Hard Problems */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-red-600">Hard</h3>
                  <Badge
                    variant="secondary"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {userData.hardSolved}/{userData.hardTotal}
                  </Badge>
                </div>
                <Progress
                  value={(userData.hardSolved / userData.hardTotal) * 100}
                  className="h-3 [&>div]:bg-red-500"
                />
                <p className="text-sm text-muted-foreground">
                  {Math.round((userData.hardSolved / userData.hardTotal) * 100)}
                  % completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Practice Collections</h2>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              View All Collections
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 100 Days Challenge */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        100 Days Challenge
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Daily coding practice
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress: 45/100
                    </span>
                    <Badge variant="secondary">45% Complete</Badge>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        Top Companies
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        FAANG interview prep
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">5 Companies</span>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blind 75 */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        Blind 75
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Essential problems
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress: 28/75
                    </span>
                    <Badge variant="secondary">37% Complete</Badge>
                  </div>
                  <Progress value={37} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Study Plans */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200 transition-all">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        Study Plans
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Structured learning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      12 Plans Available
                    </span>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contest Prep */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 group-hover:from-red-100 group-hover:to-red-200 transition-all">
                      <Trophy className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        Contest Prep
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Competitive programming
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Next: Weekly Contest
                    </span>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mock Interviews */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 group-hover:from-teal-100 group-hover:to-teal-200 transition-all">
                      <Users className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        Mock Interviews
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Practice with peers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      5 Sessions Done
                    </span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Zap className="h-6 w-6" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Coding Button */}
              <Link to="/problem">
                <Button
                  variant={"outline"}
                  size="lg"
                  className="h-20 w-full flex-col gap-2 text-base font-semibold text-yellow-700 hover:text-yellow-800 transition-all duration-300 cursor-pointer"
                >
                  <Code className="h-6 w-6" />
                  Start Coding
                </Button>
              </Link>

              {/* Daily Challenge Button */}
              <Link to="/problem">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-20 w-full flex-col gap-2 text-base font-semibold text-orange-700 hover:text-orange-800 transition-all duration-300 cursor-pointer"
                >
                  <Flame className="h-6 w-6" />
                  Daily Challenge
                </Button>
              </Link>

              {/* View Progress Button */}
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-20 w-full flex-col gap-2 text-base font-semibold text-blue-700 hover:text-blue-800 transition-all duration-300 cursor-pointer"
                >
                  <TrendingUp className="h-6 w-6" />
                  View Progress
                </Button>
              </Link>

              {/* Playlist Button */}
              <Link to="/analytics">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-20 w-full flex-col gap-2 text-base font-semibold  text-green-700 hover:text-green-800 transition-all duration-300 cursor-pointer"
                >
                  <IconPlaylistAdd className="h-6 w-6" />
                  Playlist
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
