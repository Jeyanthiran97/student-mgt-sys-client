import axios from "axios"

import { ApiValidationError } from "@/lib/api-validation-error"

type ApiErrorResponse = {
  error?: string
  errors?: string[]
}

export function normalizeApiError<T extends string>(
  error: unknown,
  fallback: string,
  fields: readonly T[]
): never {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse | undefined

    if (apiError?.errors?.length) {
      throw new ApiValidationError(apiError.errors, fields)
    }

    if (apiError?.error) throw new Error(apiError.error)
  }

  if (error instanceof Error) throw error
  throw new Error(fallback)
}
