import { z } from "zod";

// Zod schema for Google Sheet row data
export const SheetRowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.string().transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1900).max(new Date().getFullYear()))
});

export type SheetRow = z.infer<typeof SheetRowSchema>; 