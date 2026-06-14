export type Course = {
  id: number
  course_title: string
  description: string
  course_fee: number
  duration_months: number
  is_available?: boolean
  created_at?: string
}

export type CoursesApiResponse = {
  courses: Course[]
}

export type CourseApiResponse = {
  course: Course
}

export type CourseInput = {
  course_title: string
  description: string
  course_fee: number
  duration_months: number
  is_available?: boolean
}

export type CourseMutationResponse = {
  message: string
  course: Course
}
