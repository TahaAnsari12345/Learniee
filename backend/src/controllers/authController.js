import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { httpError } from "../utils/httpError.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});
const createToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

export async function signup(req, res) {
  const { name = "", email = "", password = "" } = req.body;
  if (
    name.trim().length < 2 ||
    !emailPattern.test(email) ||
    password.length < 8
  )
    throw httpError(
      400,
      "Enter a valid name, email, and password of at least 8 characters.",
    );
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  if (existing.rowCount)
    throw httpError(409, "An account with this email already exists.");
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name.trim(), email.toLowerCase(), passwordHash, "parent"],
  );
  const user = publicUser(result.rows[0]);
  res.status(201).json({ token: createToken(user), user });
}

export async function login(req, res) {
  const { email = "", password = "" } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  const account = result.rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash)))
    throw httpError(401, "Incorrect email or password.");
  const user = publicUser(account);
  res.json({ token: createToken(user), user });
}

export async function me(req, res) {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [req.user.id],
  );
  if (!result.rowCount) throw httpError(404, "Account not found.");
  res.json({ user: result.rows[0] });
}

export async function updateProfile(req, res) {
  const { name, currentPassword, newPassword } = req.body;
  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length < 2)
  )
    throw httpError(400, "Name must be at least 2 characters.");
  if (newPassword !== undefined) {
    if (typeof newPassword !== "string" || newPassword.length < 8)
      throw httpError(400, "New password must be at least 8 characters.");
    if (!currentPassword)
      throw httpError(400, "Enter your current password to set a new one.");
    const account = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.user.id],
    );
    if (
      !account.rowCount ||
      !(await bcrypt.compare(currentPassword, account.rows[0].password_hash))
    )
      throw httpError(400, "Your current password is incorrect.");
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      await bcrypt.hash(newPassword, 12),
      req.user.id,
    ]);
  }
  if (name !== undefined)
    await pool.query("UPDATE users SET name = $1 WHERE id = $2", [
      name.trim(),
      req.user.id,
    ]);
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [req.user.id],
  );
  res.json({ message: "Account updated successfully.", user: result.rows[0] });
}
