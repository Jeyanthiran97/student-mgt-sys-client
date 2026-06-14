"use client"

import { getStudent } from "@/services/student"
import type { Student } from "@/types/student"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import StudentNewEditForm from "../student-new-edit-form"
import StudentFormViewLayout from "./student-form-view-layout"

type StudentEditViewProps = {
  id: number
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "Failed to load student"
}

export default function StudentEditView({ id }: StudentEditViewProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudent(id)
      .then(setStudent)
      .catch((error) => {
        toast.error(getErrorMessage(error))
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <StudentFormViewLayout
      title="Edit Student"
      description="Update the student details below."
      breadcrumbPage="Edit Student"
    >
      {loading && (
        <p className="text-sm text-muted-foreground">Loading student...</p>
      )}

      {!loading && student && <StudentNewEditForm currentStudent={student} />}

      {!loading && !student && (
        <p className="text-sm text-muted-foreground">
          Student not found.{" "}
          <Link href="/students" className="underline underline-offset-4">
            Return to list
          </Link>
        </p>
      )}
    </StudentFormViewLayout>
  )
}
