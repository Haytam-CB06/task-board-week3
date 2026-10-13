import { CreateTaskSchema, type CreateTask } from "./schemas.ts";

export function createTask(
  payload: unknown,
): { ok: true; task: CreateTask } | { ok: false; error: string } {
  const result = CreateTaskSchema.safeParse(payload);

  if (!result.success) {
    const error = result.error.issues
      .map((issue) => issue.message)
      .join("; ");
    return { ok: false, error };
  }

  return { ok: true, task: result.data };
}
