import StudentProfileView from "@/sections/student/view/student-profile-view"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentProfileView id={Number(id)} />
    </div>
  )
}
