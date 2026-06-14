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
import { getStudent } from "@/services/student"
import type { Student } from "@/types/student"
import { ArrowLeftIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type StudentProfileViewProps = {
  id: number
}

function ProfileField({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

export default function StudentProfileView({ id }: StudentProfileViewProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudent(id)
      .then(setStudent)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/students">Students</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Student Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Student Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            {student
              ? `Viewing details for ${student.full_name}.`
              : "View student information."}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/students">
              <ArrowLeftIcon />
              Back to List
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/students/${id}/edit`}>
              <PencilIcon />
              Edit Student
            </Link>
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading student...</p>
      )}

      {!loading && student && (
        <dl className="grid gap-4 rounded-lg border p-6 sm:grid-cols-2">
          <ProfileField label="ID" value={student.id} />
          <ProfileField label="Full Name" value={student.full_name} />
          <ProfileField label="Email" value={student.email} />
          <ProfileField label="CGPA" value={student.cgpa} />
          {student.age != null && (
            <ProfileField label="Age" value={student.age} />
          )}
          {student.joined_date && (
            <ProfileField label="Joined Date" value={student.joined_date} />
          )}
          {student.is_active != null && (
            <ProfileField
              label="Status"
              value={student.is_active ? "Active" : "Inactive"}
            />
          )}
          {student.created_at && (
            <ProfileField label="Created At" value={student.created_at} />
          )}
        </dl>
      )}
    </div>
  )
}
