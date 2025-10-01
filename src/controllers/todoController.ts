import { Request, Response } from "express";
import {
  getAllTodos as getAllTodosService,
  getTodoById as getTodoByIdService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todoService";
//----------------------------------------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         completed:
 *           type: boolean
 *           description: Whether the todo is completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the todo was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the todo was last updated
 *       example:
 *         id: 1
 *         title: My Todo
 *         description: This is a todo
 *         completed: false
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal server error
 */
export async function getTodos(_req: Request, res: Response): Promise<void> {
  try {
    const todos = await getAllTodosService();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}
//----------------------------------------------------------
/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: A single todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
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
//----------------------------------------------------------
/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal server error
 */
export async function createTodo(req: Request, res: Response): Promise<void> {
  try {
    const { title, description } = req.body;
    const todo = await createTodoService({ title, description });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}
//----------------------------------------------------------
/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
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
//----------------------------------------------------------
/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     responses:
 *       204:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
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
