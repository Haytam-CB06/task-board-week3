type Task = {
  id: number;
  title: string;
  done: boolean;
};

const fromLecture: unknown = { id: 1, name: "x" };
const labelled = fromLecture as Task;
console.log("lecture example, title:", labelled.title);

try {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const live = (await response.json()) as Task;
  console.log("live title:", live.title);
  console.log("live done:", live.done);
} catch (err) {
  console.error("live fetch failed:", err);
}

export {};
