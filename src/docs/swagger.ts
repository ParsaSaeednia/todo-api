import { OpenAPIV3 } from "openapi-types";
import { getRegisteredOperations } from "./annotations";

import "../controllers/todoController";

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

const errorResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
};

const document: OpenAPIV3.Document = {
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
      ErrorResponse: errorResponseSchema,
    },
  },
  paths: {},
};

const paths: OpenAPIV3.PathsObject = {};

for (const operation of getRegisteredOperations()) {
  const pathItem = (paths[operation.path] ??= {});

  const responses: OpenAPIV3.ResponsesObject = {};
  for (const response of operation.responses) {
    const responseObject: OpenAPIV3.ResponseObject = {
      description: response.description,
    };

    if (response.schema) {
      const contentType = response.contentType ?? "application/json";
      responseObject.content = {
        [contentType]: {
          schema: response.schema,
        },
      };
    }

    responses[response.status.toString()] = responseObject;
  }

  const parameters = operation.parameters.map<OpenAPIV3.ParameterObject>((parameter) => ({
    name: parameter.name,
    in: parameter.in ?? "path",
    required: parameter.required ?? true,
    description: parameter.description,
    schema: parameter.schema,
  }));

  const requestBody = operation.requestBody
    ? {
        description: operation.requestBody.description,
        required: operation.requestBody.required,
        content: {
          [operation.requestBody.contentType ?? "application/json"]: {
            schema: operation.requestBody.schema,
          },
        },
      }
    : undefined;

  const operationObject: OpenAPIV3.OperationObject = {
    summary: operation.summary,
    description: operation.description,
    tags: operation.tags.length ? operation.tags : undefined,
    responses,
  };

  if (parameters.length) {
    operationObject.parameters = parameters;
  }

  if (requestBody) {
    operationObject.requestBody = requestBody;
  }

  pathItem[operation.method] = operationObject;
}

document.paths = paths;

export default document;
