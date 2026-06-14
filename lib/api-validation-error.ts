const FORM_FIELDS = [
  "full_name",
  "email",
  "cgpa",
  "age",
  "joined_date",
  "is_active",
] as const

export type StudentFormField = (typeof FORM_FIELDS)[number]

export class ApiValidationError extends Error {
  fieldErrors: Partial<Record<StudentFormField, string>>
  generalErrors: string[]

  constructor(errors: string[]) {
    super(errors.join(" "))
    this.name = "ApiValidationError"
    this.fieldErrors = {}
    this.generalErrors = []

    for (const message of errors) {
      const field = mapApiErrorToField(message)

      if (field) {
        this.fieldErrors[field] = message
      } else {
        this.generalErrors.push(message)
      }
    }
  }
}

function mapApiErrorToField(message: string): StudentFormField | null {
  const normalized = message.toLowerCase()

  for (const field of FORM_FIELDS) {
    if (
      normalized.startsWith(field) ||
      normalized.startsWith(field.replace("_", " "))
    ) {
      return field
    }
  }

  if (normalized.includes("email")) return "email"
  if (normalized.includes("full name") || normalized.includes("full_name")) {
    return "full_name"
  }
  if (normalized.includes("cgpa")) return "cgpa"
  if (normalized.includes("age")) return "age"
  if (
    normalized.includes("joined date") ||
    normalized.includes("joined_date")
  ) {
    return "joined_date"
  }
  if (normalized.includes("active")) return "is_active"

  return null
}

export function isApiValidationError(
  error: unknown
): error is ApiValidationError {
  return error instanceof ApiValidationError
}
