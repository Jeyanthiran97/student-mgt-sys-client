import StudentEditView from "@/sections/student/view/student-edit-view"

export default async function StudentEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentEditView id={Number(id)} />
    </div>
  )
}
