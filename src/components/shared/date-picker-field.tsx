"use client";

import { CalendarDays } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BUSINESS_TIME_ZONE = "Asia/Bangkok";

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  description?: string;
  id: string;
  label: string;
  name: FieldPath<TFieldValues>;
  placeholder?: string;
};

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  description,
  id,
  label,
  name,
  placeholder = "Select a date",
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = typeof field.value === "string" ? field.value : "";
        const selectedDate = parseBusinessDate(value);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    aria-invalid={fieldState.invalid}
                    className="w-full justify-start text-left font-normal"
                    data-empty={!selectedDate}
                    id={id}
                    variant="outline"
                  />
                }
              >
                <CalendarDays />
                {selectedDate ? formatBusinessDateLabel(selectedDate) : <span>{placeholder}</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={(date) => field.onChange(date ? formatBusinessDate(date) : "")}
                  selected={selectedDate}
                  timeZone={BUSINESS_TIME_ZONE}
                />
              </PopoverContent>
            </Popover>
            {description ? <FieldDescription>{description}</FieldDescription> : null}
            <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
          </Field>
        );
      }}
    />
  );
}

function parseBusinessDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00+07:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatBusinessDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatBusinessDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}
