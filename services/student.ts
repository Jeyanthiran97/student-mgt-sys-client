import type {
  Student,
  StudentApiResponse,
  StudentsApiResponse,
} from "@/types/student"
import axios from "axios"

const API_URL = "https://jey-student-api.up.railway.app/api/students"

function normalizeApiError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as { error?: string } | undefined
    if (apiError?.error) throw new Error(apiError.error)
  }

  if (error instanceof Error) throw error
  throw new Error(fallback)
}

export async function getStudents(): Promise<Student[]> {
  try {
    const { data } = await axios.get<StudentsApiResponse>(API_URL)
    return data.students
  } catch (error) {
    normalizeApiError(error, "Failed to load students")
  }
}

export async function getStudent(id: number): Promise<Student> {
  try {
    const { data } = await axios.get<StudentApiResponse>(`${API_URL}/${id}`)
    return data.student
  } catch (error) {
    normalizeApiError(error, "Failed to load student")
  }
}

export async function deleteStudent(id: number): Promise<void> {
// write code to delete student by id
}
