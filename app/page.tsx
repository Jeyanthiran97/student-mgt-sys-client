import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpenIcon, GraduationCapIcon } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  {
    title: "Students",
    description: "Manage student records, profiles, and enrollment.",
    href: "/students",
    icon: GraduationCapIcon,
  },
  {
    title: "Courses",
    description: "Browse and manage available courses.",
    href: "/courses",
    icon: BookOpenIcon,
  },
] as const

export default function Page() {
  return (
    <div className="container mx-auto flex flex-1 flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to the student management system. Use the sidebar to navigate
          between sections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Press <kbd className="rounded border px-1.5 py-0.5 font-mono">d</kbd> to
        toggle dark mode, or{" "}
        <kbd className="rounded border px-1.5 py-0.5 font-mono">Ctrl+B</kbd> to
        toggle the sidebar.
      </p>
    </div>
  )
}
