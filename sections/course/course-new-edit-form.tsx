"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { isApiValidationError } from "@/lib/api-validation-error"
import { createCourse, updateCourse } from "@/services/course"
import type { Course, CourseInput } from "@/types/course"

const formSchema = z.object({
  course_title: z.string().trim().min(1, "Course title is required."),
  description: z.string().trim().min(1, "Description is required."),
  course_fee: z
    .string()
    .min(1, "Course fee is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Course fee must be a number.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Course fee must be a positive number.",
    }),
  duration_months: z
    .string()
    .min(1, "Duration is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Duration must be a number.",
    })
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      { message: "Duration must be a positive whole number." }
    ),
  is_available: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export type CourseNewEditFormProps = {
  currentCourse?: Course
  formId?: string
  onSuccess: (course: Course) => void
  onCancel: () => void
}

function getDefaultValues(currentCourse?: Course): FormValues {
  return {
    course_title: currentCourse?.course_title ?? "",
    description: currentCourse?.description ?? "",
    course_fee:
      currentCourse?.course_fee != null ? String(currentCourse.course_fee) : "",
    duration_months:
      currentCourse?.duration_months != null
        ? String(currentCourse.duration_months)
        : "",
    is_available: currentCourse?.is_available ?? true,
  }
}

function toCourseInput(values: FormValues): CourseInput {
  return {
    course_title: values.course_title,
    description: values.description,
    course_fee: Number(values.course_fee),
    duration_months: Number(values.duration_months),
    is_available: values.is_available,
  }
}

export default function CourseNewEditForm({
  currentCourse,
  formId = "course-form",
  onSuccess,
  onCancel,
}: CourseNewEditFormProps) {
  const isEditMode = Boolean(currentCourse)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(currentCourse),
  })

  React.useEffect(() => {
    form.reset(getDefaultValues(currentCourse))
  }, [currentCourse, form])

  async function onSubmit(values: FormValues) {
    const payload = toCourseInput(values)

    setIsSubmitting(true)

    try {
      const course =
        isEditMode && currentCourse
          ? await updateCourse(currentCourse.id, payload)
          : await createCourse(payload)

      onSuccess(course)
    } catch (error) {
      if (isApiValidationError(error)) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          form.setError(field as keyof FormValues, {
            type: "server",
            message,
          })
        }

        if (error.generalErrors.length > 0) {
          toast.error(error.generalErrors.join(" "))
        }

        return
      }

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="course_title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="course-title">Course Title</FieldLabel>
              <Input
                {...field}
                id="course-title"
                aria-invalid={fieldState.invalid}
                placeholder="Intro to Python"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="course-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="course-description"
                aria-invalid={fieldState.invalid}
                placeholder="Brief overview of the course."
                rows={4}
                className="min-h-24 resize-none"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <div className="grid gap-7 sm:grid-cols-2">
          <Controller
            name="course_fee"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-fee">Course Fee</FieldLabel>
                <Input
                  {...field}
                  id="course-fee"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={fieldState.invalid}
                  placeholder="199.00"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="duration_months"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-duration">
                  Duration (months)
                </FieldLabel>
                <Input
                  {...field}
                  id="course-duration"
                  type="number"
                  min="1"
                  step="1"
                  aria-invalid={fieldState.invalid}
                  placeholder="3"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="is_available"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-1">
                <FieldLabel htmlFor="course-is-available">
                  Available for Enrollment
                </FieldLabel>
                <FieldDescription>
                  Unavailable courses are hidden from enrollment lists.
                </FieldDescription>
              </div>
              <Switch
                id="course-is-available"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Course"}
        </Button>
      </div>
    </form>
  )
}
