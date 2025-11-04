import { Request, Response } from "express";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "../docs/annotations";
import {
  getAllTodos as getAllTodosService,
  getTodoById as getTodoByIdService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todoService";

class TodoController {
  @ApiTags("Todos")
  @ApiOperation({
    method: "get",
    path: "/api/todos",
    summary: "Get all todos",
  })
  @ApiResponse({
    status: 200,
    description: "A list of todos",
    schema: {
      type: "array",
      items: { $ref: "#/components/schemas/Todo" },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Failed to fetch todos",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  async getTodos(_req: Request, res: Response): Promise<void> {
    try {
      const todos = await getAllTodosService();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  }

  @ApiTags("Todos")
  @ApiOperation({
    method: "get",
    path: "/api/todos/{id}",
    summary: "Get a todo by ID",
  })
  @ApiParam({
    name: "id",
    description: "The todo ID",
    schema: { type: "integer" },
  })
  @ApiResponse({
    status: 200,
    description: "A single todo",
    schema: { $ref: "#/components/schemas/Todo" },
  })
  @ApiResponse({
    status: 404,
    description: "Todo not found",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  @ApiResponse({
    status: 500,
    description: "Failed to fetch todo",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  async getTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await getTodoByIdService(parseInt(id, 10));
      res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        res.status(404).json({ error: "Todo not found" });
        return;
      }
      res.status(500).json({ error: "Failed to fetch todo" });
    }
  }

  @ApiTags("Todos")
  @ApiOperation({
    method: "post",
    path: "/api/todos",
    summary: "Create a new todo",
  })
  @ApiBody({
    description: "Todo payload",
    schema: { $ref: "#/components/schemas/TodoInput" },
  })
  @ApiResponse({
    status: 201,
    description: "Todo created",
    schema: { $ref: "#/components/schemas/Todo" },
  })
  @ApiResponse({
    status: 500,
    description: "Failed to create todo",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const todo = await createTodoService({ title, description });
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create todo" });
    }
  }

  @ApiTags("Todos")
  @ApiOperation({
    method: "put",
    path: "/api/todos/{id}",
    summary: "Update a todo",
  })
  @ApiParam({
    name: "id",
    description: "The todo ID",
    schema: { type: "integer" },
  })
  @ApiBody({
    description: "Updated todo payload",
    schema: { $ref: "#/components/schemas/TodoInput" },
  })
  @ApiResponse({
    status: 200,
    description: "Todo updated",
    schema: { $ref: "#/components/schemas/Todo" },
  })
  @ApiResponse({
    status: 404,
    description: "Todo not found",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  @ApiResponse({
    status: 500,
    description: "Failed to update todo",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const todo = await updateTodoService(parseInt(id, 10), {
        title,
        description,
        completed,
      });
      res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        res.status(404).json({ error: "Todo not found" });
        return;
      }
      res.status(500).json({ error: "Failed to update todo" });
    }
  }

  @ApiTags("Todos")
  @ApiOperation({
    method: "delete",
    path: "/api/todos/{id}",
    summary: "Delete a todo",
  })
  @ApiParam({
    name: "id",
    description: "The todo ID",
    schema: { type: "integer" },
  })
  @ApiResponse({
    status: 204,
    description: "Todo deleted",
  })
  @ApiResponse({
    status: 404,
    description: "Todo not found",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  @ApiResponse({
    status: 500,
    description: "Failed to delete todo",
    schema: { $ref: "#/components/schemas/ErrorResponse" },
  })
  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await deleteTodoService(parseInt(id, 10));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Todo not found") {
        res.status(404).json({ error: "Todo not found" });
        return;
      }
      res.status(500).json({ error: "Failed to delete todo" });
    }
  }
}

const controller = new TodoController();

export const getTodos = controller.getTodos.bind(controller);
export const getTodo = controller.getTodo.bind(controller);
export const createTodo = controller.createTodo.bind(controller);
export const updateTodo = controller.updateTodo.bind(controller);
export const deleteTodo = controller.deleteTodo.bind(controller);
