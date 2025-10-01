import { Todo } from "../models/todo";
//----------------------------------------------------------
export async function getAllTodos() {
  return await Todo.findAll();
}
//----------------------------------------------------------
export async function getTodoById(id: number): Promise<Todo> {
  const todo = await Todo.findByPk(id);
  if (!todo) throw new Error("Todo not found");

  return todo;
}
//----------------------------------------------------------

export async function createTodo(data: { title: string; description?: string }): Promise<Todo> {
  return await Todo.create(data);
}
//----------------------------------------------------------
export async function updateTodo(id: number, data: { title?: string; description?: string; completed?: boolean }) {
  const todo = await Todo.findByPk(id);
  if (!todo) throw new Error("Todo not found");

  await todo.update(data);
  return todo;
}
//----------------------------------------------------------
export async function deleteTodo(id: number): Promise<boolean> {
  const todo = await Todo.findByPk(id);
  if (!todo) throw new Error("Todo not found");

  await todo.destroy();
  return true;
}
