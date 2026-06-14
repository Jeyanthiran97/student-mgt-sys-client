"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Course } from "@/types/course"
import CourseNewEditForm from "./course-new-edit-form"

type CourseFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCourse?: Course
  onSuccess: (course: Course) => void
}

export default function CourseFormDialog({
  open,
  onOpenChange,
  currentCourse,
  onSuccess,
}: CourseFormDialogProps) {
  const isEditMode = Boolean(currentCourse)

  function handleSuccess(course: Course) {
    onSuccess(course)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the course details below."
              : "Fill in the details to create a new course."}
          </DialogDescription>
        </DialogHeader>

        <CourseNewEditForm
          key={currentCourse?.id ?? "create"}
          currentCourse={currentCourse}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
