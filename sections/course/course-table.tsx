"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Course } from "@/types/course"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

type CourseTableProps = {
  courses: Course[]
  loading: boolean
  onView: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  courseToDelete: Course | null
  isDeleting: boolean
  onConfirmDelete: () => void
  onCancelDelete: () => void
}

export default function CourseTable({
  courses,
  loading,
  onView,
  onEdit,
  onDelete,
  courseToDelete,
  isDeleting,
  onConfirmDelete,
  onCancelDelete,
}: CourseTableProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading courses...</p>
  }

  return (
    <>
      <div className="space-y-4">
        <Table>
          <TableCaption>A list of available courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="hidden sm:table-cell text-right">
                Status
              </TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{course.course_title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground md:hidden">
                        {course.duration_months} mo · $
                        {course.course_fee.toFixed(2)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.duration_months} month
                    {course.duration_months === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell className="text-right">
                    ${course.course_fee.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    {course.is_available ? "Available" : "Unavailable"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault()
                            onView(course)
                          }}
                        >
                          <EyeIcon />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault()
                            onEdit(course)
                          }}
                        >
                          <PencilIcon />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={(event) => {
                            event.preventDefault()
                            onDelete(course)
                          }}
                        >
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Total Courses: {courses.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <AlertDialog
        open={courseToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            onCancelDelete()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {courseToDelete?.course_title}
              </span>{" "}
              from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                onConfirmDelete()
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
