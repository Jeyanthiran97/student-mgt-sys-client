export const STUDENT_FORM_FIELDS = [
  "full_name",
  "email",
  "cgpa",
  "age",
  "joined_date",
  "is_active",
] as const

export type StudentFormField = (typeof STUDENT_FORM_FIELDS)[number]

export const COURSE_FORM_FIELDS = [
  "course_title",
  "description",
  "course_fee",
  "duration_months",
  "is_available",
] as const

export type CourseFormField = (typeof COURSE_FORM_FIELDS)[number]

export class ApiValidationError<T extends string = string> extends Error {
  fieldErrors: Partial<Record<T, string>>
  generalErrors: string[]

  constructor(errors: string[], fields: readonly T[]) {
    super(errors.join(" "))
    this.name = "ApiValidationError"
    this.fieldErrors = {}
    this.generalErrors = []

    for (const message of errors) {
      const field = mapApiErrorToField(message, fields)

      if (field) {
        this.fieldErrors[field] = message
      } else {
        this.generalErrors.push(message)
      }
    }
  }
}

function mapApiErrorToField<T extends string>(
  message: string,
  fields: readonly T[]
): T | null {
  const normalized = message.toLowerCase()

  for (const field of fields) {
    if (
      normalized.startsWith(field) ||
      normalized.startsWith(field.replace(/_/g, " "))
    ) {
      return field
    }
  }

  for (const field of fields) {
    const label = field.replace(/_/g, " ")
    if (normalized.includes(label) || normalized.includes(field)) {
      return field
    }
  }

  return null
}

export function isApiValidationError(
  error: unknown
): error is ApiValidationError {
  return error instanceof ApiValidationError
}
