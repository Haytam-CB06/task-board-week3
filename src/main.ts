import { z } from "zod";

import { createTask } from "./createTask.ts";
import { fetchTodo } from "./api.ts";
import { CreateTaskSchema, ExternalTodoSchema } from "./schemas.ts";

const formPayloads: unknown[] = [
  {
    title: "Design database schema",
    status: "doing",
    projectId: 1,
    dueDate: "2026-10-20",
  },
  { title: "", status: "open", projectId: 1 },
  { title: "Prepare demo", status: "finished", projectId: 1 },
  { title: "Write tests", status: "open", projectId: "1" },
  { status: "open", projectId: 1 },
];

console.log("— form boundary —");
for (const payload of formPayloads) {
  const result = createTask(payload);
  if (result.ok) {
    console.log("saved:", result.task);
  } else {
    console.log("refused:", result.error);
  }
}

console.log("\n— validation details —");

const emptyTitleResult = CreateTaskSchema.safeParse({
  title: "",
  status: "open",
  projectId: 1,
});
if (!emptyTitleResult.success) {
  console.log(
    "empty-title field errors:",
    emptyTitleResult.error.flatten().fieldErrors,
  );
}

console.log(
  "invalid due date:",
  createTask({
    title: "Prepare demo",
    status: "open",
    projectId: 1,
    dueDate: "tomorrow",
  }),
);

console.log(
  "extra form field:",
  createTask({
    title: "Design database schema",
    status: "open",
    projectId: 1,
    completed: false,
  }),
);

const queryPayload = {
  title: "From the URL",
  status: "open",
  projectId: "2",
};
const plainQueryResult = CreateTaskSchema.safeParse(queryPayload);
console.log(
  "query string without coercion:",
  plainQueryResult.success ? "accepted" : "refused",
);

const QueryTaskSchema = CreateTaskSchema.extend({
  projectId: z.coerce.number(),
});
const coercedQueryResult = QueryTaskSchema.safeParse(queryPayload);
console.log(
  "query string with explicit coercion:",
  coercedQueryResult.success
    ? `accepted with projectId ${coercedQueryResult.data.projectId}`
    : "refused",
);

console.log("\n— outside feed —");
const raw: unknown = await fetchTodo(1);
const parsed = ExternalTodoSchema.safeParse(raw);

if (!parsed.success) {
  console.log("feed refused");
} else {
  const imported = createTask({
    title: parsed.data.title,
    status: parsed.data.completed ? "done" : "open",
    projectId: 1,
  });
  console.log("imported:", imported);
}

console.log("missing todo:", await fetchTodo(99999));
