import type { Course } from "@/types/course"

type CourseViewDetailsProps = {
  course: Course
}

function DetailField({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

export default function CourseViewDetails({ course }: CourseViewDetailsProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailField label="ID" value={course.id} />
      <DetailField label="Course Title" value={course.course_title} />
      <DetailField
        label="Description"
        value={course.description}
        className="sm:col-span-2"
      />
      <DetailField
        label="Course Fee"
        value={`$${course.course_fee.toFixed(2)}`}
      />
      <DetailField
        label="Duration"
        value={`${course.duration_months} month${
          course.duration_months === 1 ? "" : "s"
        }`}
      />
      {course.is_available != null && (
        <DetailField
          label="Availability"
          value={course.is_available ? "Available" : "Unavailable"}
        />
      )}
      {course.created_at && (
        <DetailField label="Created At" value={course.created_at} />
      )}
    </dl>
  )
}
