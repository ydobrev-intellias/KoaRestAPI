const updateUserSchema = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
};
export default updateUserSchema;
