# Week 3 Lab Worksheet

**Name:** Haytam CHARAFI
**Program:** Software Engineering
**Level I aimed for today:** Challenge
**Student number:** 2303060049

## Before you run the lie

I expected `live done` to print `undefined` because the JSONPlaceholder response has a `completed` property, not a `done` property. The `as Task` assertion does not rename the field.

## After you run the lie

```text
lecture example, title: undefined
live title: delectus aut autem
live done: undefined
```

TypeScript allowed the assertion because it changes what TypeScript assumes about the value. It does not check or change the JSON at runtime, so `live.done` was still `undefined`.

## typecheck

Before I commented out the invalid assignment, `npm run typecheck` reported:

```text
src/honest.ts(11,7): error TS2322: Type 'unknown' is not assignable to type '{ title: string; status: "open" | "doing" | "done"; projectId: number; dueDate?: string | undefined; }'.
```

I commented out the two lines in `src/honest.ts` that assigned the `unknown` value to `CreateTask` and then read its title.

## Activity 1

- **To-do 99999:** I got `HTTP status: 404`, and `fetchTodo` returned `null`.
- **Dead address:** I used the closed local port `54321`. I got `Network error: TypeError: fetch failed` with `ECONNREFUSED 127.0.0.1:54321` as the cause, and the function returned `null`. Node's `fetch` rejected the suggested port `9` before trying the connection because it is a disallowed port.
- `fetch` threw for the network failure. It did not throw for the HTTP 404; I checked `response.ok` and returned `null`.
- **Stretch:** In my output, `starting fetch...` printed first, then `this line runs before the server answers`. The code before `await` runs right away. `await` pauses `fetchTodo` while it waits for the response.
- **Challenge:** An async function returns a promise right away. The caller still has to use `await` or `.then()`/`.catch()`; otherwise, it might use the promise as if it were the result or miss a rejected promise.

## Activity 2

I made the create-task schema require a non-empty title, one of the three allowed statuses, and a numeric `projectId`. It also allows an optional `dueDate` in `YYYY-MM-DD` form. I used `.strict()` so extra form fields are refused.

- **Stretch:** I confirmed that `dueDate: "tomorrow"` is refused and that a task without `dueDate` is accepted.
- **Challenge:** The flattened field errors show `title`, because the title was empty.

## Activity 3

When I ran the program, one form task was saved and four were refused. I checked the external to-do against `ExternalTodoSchema` first, then used the checked data to make a create-task payload.

```text
— form boundary —
saved: {
  title: 'Design database schema',
  status: 'doing',
  projectId: 1,
  dueDate: '2026-10-20'
}
refused: Title must contain at least one character.
refused: Status must be open, doing, or done.
refused: Project ID must be a number.
refused: Title is required.

— validation details —
empty-title field errors: { title: [ 'Title must contain at least one character.' ] }
invalid due date: { ok: false, error: 'Due date must use YYYY-MM-DD.' }
extra form field: { ok: false, error: "Unrecognized key(s) in object: 'completed'" }
query string without coercion: refused
query string with explicit coercion: accepted with projectId 2

— outside feed —
starting fetch...
this line runs before the server answers
got data: { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
imported: {
  ok: true,
  task: { title: 'delectus aut autem', status: 'open', projectId: 1 }
}
starting fetch...
this line runs before the server answers
HTTP status: 404
missing todo: null
```

I ran `npm run check`, and all validation checks passed, including the live to-do fetch and the missing to-do case.

The raw to-do was refused because it has `completed` instead of `status` and does not have a `projectId`. Having a title is not enough for it to be a valid create-task payload.

- **Stretch:** I added `.strict()` and confirmed that a create payload with `completed: false` is refused. That field is not part of the form payload.
- **Challenge:** The normal create schema refused the query payload because `projectId` was text. With a separate schema using `z.coerce.number()`, the value `"2"` was accepted as the number `2`. I would use coercion only when converting text to a number is expected for that input.

## Exit question

The boundary is where I check incoming form or feed data with `safeParse`. After it passes, I can use the parsed fields with their expected types. I still need to apply the app's rules when I map or save the task.
