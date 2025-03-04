import { JSONSchemaType } from "ajv";
import Post from "../types/Post";

export const createPostSchema: JSONSchemaType<Post> = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1 },
    content: { type: "string", minLength: 1 },
  },
  required: ["title", "content"],
  additionalProperties: false,
};

export const updatePostSchema: JSONSchemaType<Post> = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1 },
    content: { type: "string", minLength: 1 },
  },
  required: [],
  additionalProperties: false,
};
