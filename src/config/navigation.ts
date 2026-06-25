import { Home, Trophy, Users, User, LayoutDashboard, ListTodo, UsersRound, ShieldCheck, BarChart3, Bell } from "lucide-react"

export const mainNavItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { title: "Friends", href: "/friends", icon: Users },
  { title: "Profile", href: "/profile", icon: User },
] as const

export const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Campaigns", href: "/admin/campaigns", icon: ListTodo },
  { title: "Tasks", href: "/admin/tasks", icon: ListTodo },
  { title: "Users", href: "/admin/users", icon: UsersRound },
  { title: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
] as const
