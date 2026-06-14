"use client"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { deleteCourse, getCourses } from "@/services/course"
import type { Course } from "@/types/course"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import CourseFormDialog from "../course-form-dialog"
import CourseTable from "../course-table"
import CourseViewDialog from "../course-view-dialog"

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "Something went wrong."
}

export default function CourseListView() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [formCourse, setFormCourse] = useState<Course | undefined>(undefined)
  const [viewCourse, setViewCourse] = useState<Course | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadCourses = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getCourses()
      setCourses(data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCourses()
  }, [loadCourses])

  function openCreateDialog() {
    setFormCourse(undefined)
    setFormOpen(true)
  }

  function openEditDialog(course: Course) {
    setFormCourse(course)
    setFormOpen(true)
  }

  function openViewDialog(course: Course) {
    setViewCourse(course)
    setViewOpen(true)
  }

  function handleFormSuccess(course: Course) {
    setCourses((current) => {
      const exists = current.some((item) => item.id === course.id)

      if (exists) {
        return current.map((item) => (item.id === course.id ? course : item))
      }

      return [...current, course]
    })

    toast.success(
      formCourse
        ? "Course updated successfully."
        : "Course created successfully."
    )
    setFormCourse(undefined)
  }

  async function handleConfirmDelete() {
    if (!courseToDelete) return

    setIsDeleting(true)

    try {
      await deleteCourse(courseToDelete.id)
      setCourses((current) =>
        current.filter((course) => course.id !== courseToDelete.id)
      )
      toast.success("Course deleted successfully.")
      setCourseToDelete(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Courses</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon />
          Add Course
        </Button>
      </div>

      <CourseTable
        courses={courses}
        loading={loading}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={setCourseToDelete}
        courseToDelete={courseToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={() => setCourseToDelete(null)}
      />

      <CourseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        currentCourse={formCourse}
        onSuccess={handleFormSuccess}
      />

      <CourseViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        course={viewCourse}
        onEdit={openEditDialog}
      />
    </div>
  )
}
