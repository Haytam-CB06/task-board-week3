export async function fetchTodo(id: number): Promise<unknown> {
  console.log("starting fetch...");
  console.log("this line runs before the server answers");

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    );

    if (!response.ok) {
      console.log("HTTP status:", response.status);
      return null;
    }

    const data: unknown = await response.json();
    console.log("got data:", data);
    return data;
  } catch (error: unknown) {
    console.log("Network error:", error);
    return null;
  }

}
