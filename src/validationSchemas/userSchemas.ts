import { JSONSchemaType } from "ajv";
import User from "../types/User";

export const createUserSchema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

export const updateUserSchema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: [],
  additionalProperties: false,
};
