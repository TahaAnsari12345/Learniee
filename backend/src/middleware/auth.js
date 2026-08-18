import jwt from "jsonwebtoken";
import { httpError } from "../utils/httpError.js";

export function requireAuth(req, _res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw httpError(401, "Please sign in to continue.");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(
      error.status
        ? error
        : httpError(401, "Your session has expired. Please sign in again."),
    );
  }
}
