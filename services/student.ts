import { ApiValidationError } from "@/lib/api-validation-error"
import type {
  Student,
  StudentApiResponse,
  StudentInput,
  StudentMutationResponse,
  StudentsApiResponse,
} from "@/types/student"
import axios from "axios"

const API_URL = "https://jey-student-api.up.railway.app/api/students"

type ApiErrorResponse = {
  error?: string
  errors?: string[]
}

function normalizeApiError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse | undefined

    if (apiError?.errors?.length) {
      throw new ApiValidationError(apiError.errors)
    }

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

export async function createStudent(input: StudentInput): Promise<Student> {
  try {
    const { data } = await axios.post<StudentMutationResponse>(API_URL, input)
    return data.student
  } catch (error) {
    normalizeApiError(error, "Failed to create student")
  }
}

export async function updateStudent(
  id: number,
  input: StudentInput
): Promise<Student> {
  try {
    const { data } = await axios.put<StudentMutationResponse>(
      `${API_URL}/${id}`,
      input
    )
    return data.student
  } catch (error) {
    normalizeApiError(error, "Failed to update student")
  }
}

export async function deleteStudent(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/${id}`)
  } catch (error) {
    normalizeApiError(error, "Failed to delete student")
  }
}
