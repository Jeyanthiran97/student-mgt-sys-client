"use client"

import { Button } from "@/components/ui/button"
import { getStudent } from "@/services/student"
import type { Student } from "@/types/student"
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Student Profile</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/students">Back to List</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
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
