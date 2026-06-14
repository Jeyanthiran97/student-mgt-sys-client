import { normalizeApiError } from "@/lib/api-error"
import { COURSE_FORM_FIELDS } from "@/lib/api-validation-error"
import type {
  Course,
  CourseApiResponse,
  CourseInput,
  CourseMutationResponse,
  CoursesApiResponse,
} from "@/types/course"
import axios from "axios"

const API_URL = "https://jey-student-api.up.railway.app/api/courses"

export async function getCourses(): Promise<Course[]> {
  try {
    const { data } = await axios.get<CoursesApiResponse>(API_URL)
    return data.courses
  } catch (error) {
    normalizeApiError(error, "Failed to load courses", COURSE_FORM_FIELDS)
  }
}

export async function getCourse(id: number): Promise<Course> {
  try {
    const { data } = await axios.get<CourseApiResponse>(`${API_URL}/${id}`)
    return data.course
  } catch (error) {
    normalizeApiError(error, "Failed to load course", COURSE_FORM_FIELDS)
  }
}

export async function createCourse(input: CourseInput): Promise<Course> {
  try {
    const { data } = await axios.post<CourseMutationResponse>(API_URL, input)
    return data.course
  } catch (error) {
    normalizeApiError(error, "Failed to create course", COURSE_FORM_FIELDS)
  }
}

export async function updateCourse(
  id: number,
  input: CourseInput
): Promise<Course> {
  try {
    const { data } = await axios.put<CourseMutationResponse>(
      `${API_URL}/${id}`,
      input
    )
    return data.course
  } catch (error) {
    normalizeApiError(error, "Failed to update course", COURSE_FORM_FIELDS)
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/${id}`)
  } catch (error) {
    normalizeApiError(error, "Failed to delete course", COURSE_FORM_FIELDS)
  }
}
