import { BookOpenIcon, CodeIcon, MessageSquareIcon, TrendingUpIcon } from "lucide-react"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-xl">
            LeetCode's Interview Crash Course
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}


export function dsfs() {
  return (
    <div className="grid lg:grid-cols-4 gap-3 px-4 lg:px-6">
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md ">
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold leading-tight text-slate-800">
                LeetCode's Interview Crash Course
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">Data Structures and Algorithms</CardDescription>
            </div>
            <CodeIcon className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4 px-4">
          <div className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            Start Learning →
          </div>
        </CardContent>
      </Card>

      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:border-amber-300">
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold leading-tight text-amber-900">
                Trending Interview Topics
              </CardTitle>
              <CardDescription className="text-xs text-amber-700">Most-Asked Qs by Top Companies</CardDescription>
            </div>
            <TrendingUpIcon className="h-4 w-4 text-amber-600 group-hover:text-amber-800 transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4 px-4">
          <div className="text-xs font-medium text-amber-800 group-hover:text-amber-900 transition-colors">
            Claim Now →
          </div>
        </CardContent>
      </Card>

      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:border-blue-300">
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold leading-tight text-blue-900">
                Top Interview Questions
              </CardTitle>
              <CardDescription className="text-xs text-blue-700">Practice with Real Examples</CardDescription>
            </div>
            <MessageSquareIcon className="h-4 w-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4 px-4">
          <div className="text-xs font-medium text-blue-800 group-hover:text-blue-900 transition-colors">
            Get Started →
          </div>
        </CardContent>
      </Card>

      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200 hover:border-emerald-300">
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold leading-tight text-emerald-900">
                JavaScript Challenge
              </CardTitle>
              <CardDescription className="text-xs text-emerald-700">30 Days - Beginner Friendly</CardDescription>
            </div>
            <BookOpenIcon className="h-4 w-4 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4 px-4">
          <div className="text-xs font-medium text-emerald-800 group-hover:text-emerald-900 transition-colors">
            Start Learning →
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
