import { OpenAPIV3 } from "openapi-types";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "options" | "head";

type SchemaOrRef = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;

interface ResponseMetadata {
  status: number;
  description: string;
  schema?: SchemaOrRef;
  contentType?: string;
}

interface ParameterMetadata {
  name: string;
  in?: OpenAPIV3.ParameterObject["in"];
  required?: boolean;
  description?: string;
  schema: SchemaOrRef;
}

interface RequestBodyMetadata {
  description?: string;
  required?: boolean;
  contentType?: string;
  schema: SchemaOrRef;
}

interface OperationMetadata {
  method?: HttpMethod;
  path?: string;
  summary?: string;
  description?: string;
  tags: Set<string>;
  responses: ResponseMetadata[];
  parameters: ParameterMetadata[];
  requestBody?: RequestBodyMetadata;
}

const operationRegistry = new Map<Function, OperationMetadata>();

function ensureOperationMetadata(handler: Function): OperationMetadata {
  let metadata = operationRegistry.get(handler);
  if (!metadata) {
    metadata = {
      tags: new Set<string>(),
      responses: [],
      parameters: [],
    };
    operationRegistry.set(handler, metadata);
  }
  return metadata;
}

function extractHandler(
  descriptor: PropertyDescriptor | undefined,
  decoratorName: string
): Function {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new Error(`${decoratorName} can only be applied to methods`);
  }
  return descriptor.value;
}

export interface ApiOperationOptions {
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  tags?: string[];
}

export function ApiOperation(options: ApiOperationOptions): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const handler = extractHandler(descriptor, "ApiOperation");
    const metadata = ensureOperationMetadata(handler);
    metadata.method = options.method;
    metadata.path = options.path;
    metadata.summary = options.summary;
    metadata.description = options.description;
    if (options.tags) {
      options.tags.forEach((tag) => metadata.tags.add(tag));
    }
  };
}

export function ApiTags(...tags: string[]): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const handler = extractHandler(descriptor, "ApiTags");
    const metadata = ensureOperationMetadata(handler);
    tags.forEach((tag) => metadata.tags.add(tag));
  };
}

export interface ApiResponseOptions {
  status: number;
  description: string;
  schema?: SchemaOrRef;
  contentType?: string;
}

export function ApiResponse(options: ApiResponseOptions): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const handler = extractHandler(descriptor, "ApiResponse");
    const metadata = ensureOperationMetadata(handler);
    metadata.responses.push({
      status: options.status,
      description: options.description,
      schema: options.schema,
      contentType: options.contentType,
    });
  };
}

export interface ApiParamOptions {
  name: string;
  in?: OpenAPIV3.ParameterObject["in"];
  required?: boolean;
  description?: string;
  schema: SchemaOrRef;
}

export function ApiParam(options: ApiParamOptions): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const handler = extractHandler(descriptor, "ApiParam");
    const metadata = ensureOperationMetadata(handler);
    metadata.parameters.push({
      name: options.name,
      in: options.in ?? "path",
      required: options.required ?? true,
      description: options.description,
      schema: options.schema,
    });
  };
}

export interface ApiBodyOptions {
  description?: string;
  required?: boolean;
  contentType?: string;
  schema: SchemaOrRef;
}

export function ApiBody(options: ApiBodyOptions): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const handler = extractHandler(descriptor, "ApiBody");
    const metadata = ensureOperationMetadata(handler);
    metadata.requestBody = {
      description: options.description,
      required: options.required ?? true,
      contentType: options.contentType ?? "application/json",
      schema: options.schema,
    };
  };
}

export interface RegisteredOperation {
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  responses: ResponseMetadata[];
  parameters: ParameterMetadata[];
  requestBody?: RequestBodyMetadata;
}

export function getRegisteredOperations(): RegisteredOperation[] {
  return Array.from(operationRegistry.values())
    .filter((metadata) => metadata.method && metadata.path)
    .map((metadata) => ({
      method: metadata.method!,
      path: metadata.path!,
      summary: metadata.summary,
      description: metadata.description,
      tags: Array.from(metadata.tags),
      responses: metadata.responses,
      parameters: metadata.parameters,
      requestBody: metadata.requestBody,
    }));
}
