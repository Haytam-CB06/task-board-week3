import type { CreateTask } from "./schemas.ts";

const payload: unknown = {
  title: "Design database schema",
  status: "open",
  projectId: 1,
};

// Run `npm run typecheck` and read the error.
// The assignment fails because `payload` has not been checked at runtime.
 //const task : CreateTask = payload;
 //console.log(task.title);
