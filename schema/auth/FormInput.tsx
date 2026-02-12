'use client'

import { useFormContext, Controller, Path, FieldValues } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

type FormInputProps<TFieldValues extends FieldValues> = {
    name: Path<TFieldValues>
    label: string
    placeholder?: string
    type?: string
}

export function FormInput<TFieldValues extends FieldValues>({
    name,
    label,
    placeholder,
    type = "text",
}: FormInputProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel>{label}</FieldLabel>

                    <Input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    )
}
