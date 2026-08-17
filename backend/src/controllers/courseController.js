import { pool } from '../db/pool.js';

const orderBy = { price_asc: 'price ASC', price_desc: 'price DESC', rating_desc: 'rating DESC', rating_asc: 'rating ASC', default: 'created_at DESC' };

export async function listCourses(req, res) {
  const { search, grade, subject, minPrice, maxPrice, rating, sort = 'default' } = req.query;
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 9, 1), 50);
  const where = []; const values = [];
  const add = (column, operator, value) => { values.push(value); where.push(`${column} ${operator} $${values.length}`); };
  if (search) { values.push(`%${search}%`); where.push(`(course_name ILIKE $${values.length} OR subject ILIKE $${values.length})`); }
  if (grade) add('grade', '=', Number(grade));
  if (subject) add('subject', '=', subject);
  if (minPrice) add('price', '>=', Number(minPrice));
  if (maxPrice) add('price', '<=', Number(maxPrice));
  if (rating) add('rating', '>=', Number(rating));
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = await pool.query(`SELECT COUNT(*)::int AS count FROM courses ${clause}`, values);
  const totalItems = total.rows[0].count; values.push(limit, (page - 1) * limit);
  const result = await pool.query(`SELECT id, course_name AS "title", description, subject, grade, price, teacher_name AS teacher, rating, image_url FROM courses ${clause} ORDER BY ${orderBy[sort] || orderBy.default} LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  res.json({ courses: result.rows, pagination: { currentPage: page, totalPages: Math.max(Math.ceil(totalItems / limit), 1), totalItems, limit } });
}

export async function getCourse(req, res) {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) return res.status(404).json({ message: 'Course not found.' });
  const result = await pool.query('SELECT id, course_name AS "title", description, subject, grade, price, teacher_name AS teacher, rating, image_url FROM courses WHERE id = $1', [id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Course not found.' });
  res.json({ course: result.rows[0] });
}
