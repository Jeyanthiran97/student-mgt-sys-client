import StudentNewEditForm from "../student-new-edit-form"
import StudentFormViewLayout from "./student-form-view-layout"

export default function StudentCreateView() {
  return (
    <StudentFormViewLayout
      title="Add Student"
      description="Fill in the details to register a new student."
      breadcrumbPage="Add Student"
    >
      <StudentNewEditForm />
    </StudentFormViewLayout>
  )
}
