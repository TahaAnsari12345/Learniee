import { ArrowUpRight, BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const illustrations = {
  orange: "∑",
  blue: "</>",
  purple: "⚗",
  green: "Aa",
  pink: "⚙",
  yellow: "↗",
  coral: "✦",
  teal: "◒",
};

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <article
      className="course-card clickable"
      role="link"
      tabIndex="0"
      onClick={() => navigate(`/courses/${course.id}`)}
      onKeyDown={(event) =>
        event.key === "Enter" && navigate(`/courses/${course.id}`)
      }
    >
      <div className={`course-art ${course.color}`}>
        <span>{illustrations[course.color]}</span>
        <button type="button" aria-label={`View ${course.title}`}>
          <ArrowUpRight size={18} />
        </button>
      </div>
      <div className="course-content">
        <div className="card-meta">
          <span>{course.subject}</span>
          <span>{course.grade}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="teacher-row">
          <div className="teacher-avatar">
            {course.teacher
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <strong>{course.teacher}</strong>
            <div className="rating">
              <Star size={14} fill="currentColor" /> {course.rating}{" "}
              <em>({course.reviews || "new"})</em>
            </div>
          </div>
          <b>₹{Number(course.price).toLocaleString("en-IN")}</b>
        </div>
      </div>
    </article>
  );
}
