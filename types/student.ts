export type Student = {
  id: number
  full_name: string
  email: string
  cgpa: number
  age?: number
  created_at?: string
  is_active?: boolean
  joined_date?: string
}

export type StudentsApiResponse = {
  students: Student[]
}

export type StudentApiResponse = {
  student: Student
}

export type StudentInput = {
  full_name: string
  email: string
  cgpa: number
  age?: number
  joined_date?: string
  is_active?: boolean
}

export type StudentMutationResponse = {
  message: string
  student: Student
}
