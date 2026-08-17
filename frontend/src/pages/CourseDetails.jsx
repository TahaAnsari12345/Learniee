import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [state, setState] = useState("loading");
  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then(({ data }) => {
        setCourse(data.course);
        setState("ready");
      })
      .catch((error) =>
        setState(error.response?.status === 404 ? "missing" : "error"),
      );
  }, [id]);
  if (state !== "ready")
    return (
      <main className="detail-state">
        <h2>
          {state === "loading"
            ? "Loading course…"
            : state === "missing"
              ? "Course not found"
              : "Unable to load this course"}
        </h2>
        <Link to="/dashboard">Back to courses</Link>
      </main>
    );
  return (
    <main className="details-page">
      <Link className="back-link" to="/dashboard">
        <ArrowLeft size={17} /> Back to courses
      </Link>
      <section className="details-card">
        <div className="detail-art">{course.subject.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">
            {course.subject} · Grade {course.grade}
          </p>
          <h1>{course.title}</h1>
          <p className="detail-description">{course.description}</p>
          <dl>
            <div>
              <dt>Teacher</dt>
              <dd>{course.teacher}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>
                <Star size={15} fill="currentColor" /> {course.rating}
              </dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>₹{Number(course.price).toLocaleString("en-IN")}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
