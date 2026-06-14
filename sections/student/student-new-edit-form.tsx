"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { createStudent, updateStudent } from "@/services/student"
import { isApiValidationError } from "@/lib/api-validation-error"
import type { Student, StudentInput } from "@/types/student"
import { useEffect } from "react"

const formSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  cgpa: z
    .string()
    .min(1, "CGPA is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "CGPA must be a number.",
    })
    .refine((value) => Number(value) >= 0 && Number(value) <= 4, {
      message: "CGPA must be between 0 and 4.",
    }),
  age: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (!Number.isNaN(Number(value)) &&
          Number.isInteger(Number(value)) &&
          Number(value) >= 1 &&
          Number(value) <= 120),
      { message: "Age must be a whole number between 1 and 120." }
    ),
  joined_date: z.string().min(1, "Joined date is required."),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

type StudentNewEditFormProps = {
  currentStudent?: Student
}

function getDefaultValues(currentStudent?: Student): FormValues {
  return {
    full_name: currentStudent?.full_name ?? "",
    email: currentStudent?.email ?? "",
    cgpa: currentStudent?.cgpa != null ? String(currentStudent.cgpa) : "",
    age: currentStudent?.age != null ? String(currentStudent.age) : "",
    joined_date: currentStudent?.joined_date ?? "",
    is_active: currentStudent?.is_active ?? true,
  }
}

function toStudentInput(values: FormValues): StudentInput {
  return {
    full_name: values.full_name,
    email: values.email,
    cgpa: Number(values.cgpa),
    age: values.age === "" ? undefined : Number(values.age),
    joined_date: values.joined_date,
    is_active: values.is_active,
  }
}

export default function StudentNewEditForm({
  currentStudent,
}: StudentNewEditFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(currentStudent)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(currentStudent),
  })

  useEffect(() => {
    form.reset(getDefaultValues(currentStudent))
  }, [currentStudent, form])

  async function onSubmit(values: FormValues) {
    const payload = toStudentInput(values)

    setIsSubmitting(true)

    try {
      if (isEditMode && currentStudent) {
        await updateStudent(currentStudent.id, payload)
        toast.success("Student updated successfully.")
      } else {
        await createStudent(payload)
        toast.success("Student created successfully.")
      }

      router.push("/students")
      router.refresh()
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

      const message =
        error instanceof Error ? error.message : "Something went wrong."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form id="student-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-7 sm:grid-cols-2">
              <Controller
                name="full_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
                    <FieldLabel htmlFor="student-full-name">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="student-full-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
                    <FieldLabel htmlFor="student-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="student-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="john.doe@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="cgpa"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-cgpa">CGPA</FieldLabel>
                    <Input
                      {...field}
                      id="student-cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      aria-invalid={fieldState.invalid}
                      placeholder="3.50"
                    />
                    <FieldDescription>Scale from 0.00 to 4.00</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="age"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-age">Age</FieldLabel>
                    <Input
                      {...field}
                      id="student-age"
                      type="number"
                      min="1"
                      max="120"
                      aria-invalid={fieldState.invalid}
                      placeholder="20"
                      value={field.value}
                    />
                    <FieldDescription>Optional</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="joined_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="student-joined-date">
                      Joined Date
                    </FieldLabel>
                    <Input
                      {...field}
                      id="student-joined-date"
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="is_active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="items-center justify-between rounded-md border p-4"
                  >
                    <div className="space-y-1">
                      <FieldLabel htmlFor="student-is-active">
                        Active Status
                      </FieldLabel>
                      <FieldDescription>
                        Inactive students are hidden from active lists.
                      </FieldDescription>
                    </div>
                    <Switch
                      id="student-is-active"
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
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(getDefaultValues(currentStudent))}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" form="student-form" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Student"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
