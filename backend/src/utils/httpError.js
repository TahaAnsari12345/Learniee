export const httpError = (status, message) =>
  Object.assign(new Error(message), { status });
