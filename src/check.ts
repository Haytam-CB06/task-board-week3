import { fetchTodo } from "./api.ts";
import { createTask } from "./createTask.ts";
import { ExternalTodoSchema } from "./schemas.ts";

let failed = 0;

function pass(label: string) {
  console.log("PASS", label);
}

function fail(label: string, detail: string) {
  failed += 1;
  console.error("FAIL", label);
  console.error("    ", detail);
}

function expectSaved(label: string, payload: unknown, title: string) {
  const result = createTask(payload);
  if (!result.ok) {
    fail(label, `a valid task was refused: ${result.error}`);
    return;
  }
  if (result.task.title !== title) {
    fail(label, `title was ${String(result.task.title)}, expected ${title}`);
    return;
  }
  pass(label);
}

function expectRefused(label: string, payload: unknown) {
  const result = createTask(payload);
  if (result.ok) {
    fail(label, "bad data was accepted and would have been saved");
    return;
  }
  if (result.error.trim().length === 0) {
    fail(label, "the task was refused, but the error message is empty");
    return;
  }
  pass(label);
}

expectSaved(
  "valid create-task",
  {
    title: "Design database schema",
    status: "doing",
    projectId: 1,
    dueDate: "2026-10-20",
  },
  "Design database schema",
);

expectSaved(
  "due date may be omitted",
  { title: "Write project proposal", status: "done", projectId: 2 },
  "Write project proposal",
);

expectRefused("empty title", { title: "", status: "open", projectId: 1 });
expectRefused("missing title", { status: "open", projectId: 1 });
expectRefused("status finished", {
  title: "Prepare demo",
  status: "finished",
  projectId: 1,
});
expectRefused("projectId sent as text", {
  title: "Write tests",
  status: "open",
  projectId: "1",
});
expectRefused("raw to-do from another site", {
  userId: 1,
  id: 1,
  title: "delectus aut autem",
  completed: false,
});

const realTodo = {
  userId: 1,
  id: 1,
  title: "delectus aut autem",
  completed: false,
};
const todoResult = ExternalTodoSchema.safeParse(realTodo);
const todoData = todoResult.success
  ? (todoResult.data as { title?: string; completed?: boolean })
  : null;
if (!todoResult.success || todoData === null) {
  fail("external to-do shape", "a normal jsonplaceholder to-do was rejected");
} else if (todoData.title !== realTodo.title) {
  fail("external to-do shape", "title was not kept");
} else if (todoData.completed !== false) {
  fail(
    "external to-do shape",
    "completed is missing. The outside feed uses completed, not done.",
  );
} else {
  pass("external to-do shape");
}

const brokenTodo = { userId: 1, id: 1, completed: false };
if (ExternalTodoSchema.safeParse(brokenTodo).success) {
  fail("to-do without a title", "a to-do with no title was accepted");
} else {
  pass("to-do without a title");
}

const live = await Promise.race([
  fetchTodo(1),
  new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 8000)),
]);

if (live === undefined || live === null) {
  console.log(
    "SKIP live fetch. No answer came back in time. Finish Activity 1 and run npm run check again on a working network.",
  );
} else if (typeof live !== "object") {
  fail("live fetch /todos/1", "expected an object from the server");
} else {
  pass("live fetch /todos/1");
  const missing = await fetchTodo(99999);
  if (missing === null) {
    pass("live fetch /todos/99999 returns null");
  } else {
    fail(
      "live fetch /todos/99999",
      "a missing to-do should return null after a non-OK response, not the body",
    );
  }
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}

console.log("\nValidation checks passed.");
