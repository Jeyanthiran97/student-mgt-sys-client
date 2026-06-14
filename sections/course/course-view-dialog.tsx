"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Course } from "@/types/course"
import { PencilIcon } from "lucide-react"
import CourseViewDetails from "./course-view-details"

type CourseViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onEdit: (course: Course) => void
}

export default function CourseViewDialog({
  open,
  onOpenChange,
  course,
  onEdit,
}: CourseViewDialogProps) {
  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{course.course_title}</DialogTitle>
          <DialogDescription>Course details and enrollment info.</DialogDescription>
        </DialogHeader>

        <CourseViewDetails course={course} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              onEdit(course)
            }}
          >
            <PencilIcon />
            Edit Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
