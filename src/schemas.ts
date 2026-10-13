import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title must be text.",
    })
    .min(1, "Title must contain at least one character."),
  status: z.enum(["open", "doing", "done"], {
    errorMap: (issue) => ({
      message:
        issue.code === "invalid_type" && issue.received === "undefined"
          ? "Status is required."
          : "Status must be open, doing, or done.",
    }),
  }),
  projectId: z.number({
    required_error: "Project ID is required.",
    invalid_type_error: "Project ID must be a number.",
  }),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD.")
    .optional(),
}).strict();

export type CreateTask = z.infer<typeof CreateTaskSchema>;

export const ExternalTodoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string().min(1, "To-do title is required."),
  completed: z.boolean(),
});
