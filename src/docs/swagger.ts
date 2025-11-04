import { OpenAPIV3 } from "openapi-types";

const jsonResponse = (
  description: string,
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

const errorResponse = (description: string): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});

const todoSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["title"],
  properties: {
    id: {
      type: "integer",
      description: "The auto-generated id of the todo",
    },
    title: {
      type: "string",
      description: "The title of the todo",
    },
    description: {
      type: "string",
      description: "The description of the todo",
    },
    completed: {
      type: "boolean",
      description: "Whether the todo is completed",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "The date the todo was created",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "The date the todo was last updated",
    },
  },
  example: {
    id: 1,
    title: "My Todo",
    description: "This is a todo",
    completed: false,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
};

const todoInputSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    completed: { type: "boolean" },
  },
};

const todoIdParameter: OpenAPIV3.ParameterObject = {
  in: "path",
  name: "id",
  required: true,
  description: "The todo ID",
  schema: { type: "integer" },
};

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "A simple Todo API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      Todo: todoSchema,
      TodoInput: todoInputSchema,
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
    parameters: {
      TodoId: todoIdParameter,
    },
  },
  paths: {
    "/api/todos": {
      get: {
        summary: "Get all todos",
        responses: {
          200: jsonResponse("A list of todos", {
            type: "array",
            items: { $ref: "#/components/schemas/Todo" },
          }),
          500: errorResponse("Failed to fetch todos"),
        },
      },
      post: {
        summary: "Create a new todo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TodoInput" },
            },
          },
        },
        responses: {
          201: jsonResponse("Todo created", { $ref: "#/components/schemas/Todo" }),
          500: errorResponse("Failed to create todo"),
        },
      },
    },
    "/api/todos/{id}": {
      get: {
        summary: "Get a todo by ID",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        responses: {
          200: jsonResponse("A single todo", { $ref: "#/components/schemas/Todo" }),
          404: errorResponse("Todo not found"),
          500: errorResponse("Failed to fetch todo"),
        },
      },
      put: {
        summary: "Update a todo",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TodoInput" },
            },
          },
        },
        responses: {
          200: jsonResponse("Todo updated", { $ref: "#/components/schemas/Todo" }),
          404: errorResponse("Todo not found"),
          500: errorResponse("Failed to update todo"),
        },
      },
      delete: {
        summary: "Delete a todo",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        responses: {
          204: { description: "Todo deleted" },
          404: errorResponse("Todo not found"),
          500: errorResponse("Failed to delete todo"),
        },
      },
    },
  },
};

export default swaggerDocument;
