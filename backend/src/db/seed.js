import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pool } from "./pool.js";

const subjects = [
  [
    "Mathematics",
    "Mathematics Mastery",
    "Build confidence with foundations and guided problem solving.",
  ],
  [
    "Science",
    "Everyday Science Lab",
    "Explore how the world works through curious, hands-on learning.",
  ],
  [
    "English",
    "English Expression",
    "Strengthen writing, grammar, and communication with ease.",
  ],
  [
    "Coding",
    "Young Coders: Python",
    "Create games and creative projects while learning code.",
  ],
  [
    "Physics",
    "Physics Made Visual",
    "Make big concepts clear with interactive visual lessons.",
  ],
  [
    "Chemistry",
    "Chemistry Essentials",
    "A structured route through reactions and equations.",
  ],
  [
    "Robotics",
    "Robotics Foundations",
    "Design and build exciting beginner robotics projects.",
  ],
  [
    "Mathematics",
    "Geometry Explorer",
    "Think visually, reason clearly, and solve new challenges.",
  ],
  [
    "Science",
    "Environmental Detectives",
    "Investigate nature, ecosystems, and the changing planet.",
  ],
  [
    "English",
    "Creative Writing Club",
    "Turn imaginative ideas into vivid stories.",
  ],
];
const teachers = [
  "Ananya Rao",
  "Vikram Mehta",
  "Priya Nair",
  "Ishita Kapoor",
  "Arjun Shah",
  "Kabir Singh",
  "Meera Iyer",
  "Rohan Das",
  "Sana Gupta",
  "Dev Malhotra",
];

async function seed() {
  await pool.query(
    await readFile(new URL("./schema.sql", import.meta.url), "utf8"),
  );
  await pool.query("TRUNCATE courses RESTART IDENTITY");
  for (let index = 0; index < 120; index += 1) {
    const [subject, title, description] = subjects[index % subjects.length];
    await pool.query(
      "INSERT INTO courses (course_name, description, subject, grade, price, teacher_name, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        index < 10
          ? title
          : `${title} ${["Essentials", "Workshop"][index % 2]}`,
        description,
        subject,
        5 + (index % 6),
        649 + ((index * 137) % 1000),
        teachers[index % teachers.length],
        4.1 + (index % 9) / 10,
      ],
    );
  }
  console.log("Seeded 120 courses.");
}
seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
