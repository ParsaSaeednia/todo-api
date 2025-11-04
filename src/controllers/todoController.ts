import { Request, Response } from "express";
import {
  getAllTodos as getAllTodosService,
  getTodoById as getTodoByIdService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todoService";
export async function getTodos(_req: Request, res: Response): Promise<void> {
  try {
    const todos = await getAllTodosService();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}
export async function getTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const todo = await getTodoByIdService(parseInt(id));
    res.json(todo);
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(500).json({ error: "Failed to fetch todo" });
  }
}
export async function createTodo(req: Request, res: Response): Promise<void> {
  try {
    const { title, description } = req.body;
    const todo = await createTodoService({ title, description });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}
export async function updateTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await updateTodoService(parseInt(id), { title, description, completed });
    res.json(todo);
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(500).json({ error: "Failed to update todo" });
  }
}
export async function deleteTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await deleteTodoService(parseInt(id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "Todo not found") {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(500).json({ error: "Failed to delete todo" });
  }
}
