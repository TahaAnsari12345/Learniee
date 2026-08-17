import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Grid2X2,
  Heart,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import CourseDetails from "./pages/CourseDetails";
import ProfilePage from "./pages/ProfilePage";

const defaultFilters = {
  grade: "All grades",
  subject: "All subjects",
  min: "",
  max: "",
  rating: "Any rating",
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("Recommended");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setLoadError("");
      try {
        const params = {
          search: query || undefined,
          grade:
            filters.grade === "All grades"
              ? undefined
              : filters.grade.replace("Grade ", ""),
          subject:
            filters.subject === "All subjects" ? undefined : filters.subject,
          minPrice: filters.min || undefined,
          maxPrice: filters.max || undefined,
          rating:
            filters.rating === "4.5 & above"
              ? 4.5
              : filters.rating === "4.0 & above"
                ? 4
                : undefined,
          sort: {
            "Price: Low to high": "price_asc",
            "Price: High to low": "price_desc",
            "Rating: High to low": "rating_desc",
          }[sort],
          page,
          limit: 9,
        };
        const { data } = await api.get("/courses", { params });
        setResults(
          data.courses.map((course, index) => ({
            ...course,
            grade: `Grade ${course.grade}`,
            color: [
              "orange",
              "blue",
              "purple",
              "green",
              "pink",
              "yellow",
              "coral",
              "teal",
            ][index % 8],
          })),
        );
        setPagination(data.pagination);
      } catch {
        setLoadError(
          "Courses are unavailable right now. Please try again shortly.",
        );
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, filters, sort, page]);
  const updateFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  };
  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#top">
          <span>l</span>learniee
        </a>
        <nav className={navOpen ? "shown" : ""}>
          <a className="active" href="#explore">
            Explore courses
          </a>
          <a href="#saved">Saved</a>
          <a href="#help">Help centre</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn notification" aria-label="Notifications">
            <Bell size={19} />
            <i />
          </button>
          <a className="profile" href="/profile">
            <span>
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
            <ChevronDown size={16} />
          </a>
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
          <button className="menu-btn" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">
              <Sparkles size={15} /> YOUR CHILD'S LEARNING JOURNEY
            </p>
            <h1>
              Welcome, {user.name} <span>👋</span>
            </h1>
            <p>
              Find engaging courses that help your child grow with confidence.
            </p>
          </div>
          <div className="hero-stat">
            <div className="progress-ring">
              68<small>%</small>
            </div>
            <div>
              <b>Learning profile</b>
              <p>You're off to a great start!</p>
              <a href="/profile">Edit account</a>
            </div>
          </div>
        </section>
        <section id="explore" className="explore-header">
          <div>
            <h2>Explore courses</h2>
            <p>Thoughtfully selected learning experiences for curious minds.</p>
          </div>
          <button className="saved-btn">
            <Heart size={17} /> Saved courses <span>2</span>
          </button>
        </section>
        <section className="search-panel">
          <Search size={21} />
          <input
            aria-label="Search courses"
            placeholder="Search courses or subjects..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <span className="shortcut">⌘ K</span>
        </section>
        <div className="content-layout">
          <Filters
            filters={filters}
            onChange={updateFilter}
            onReset={() => {
              setFilters(defaultFilters);
              setPage(1);
            }}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <section className="catalog">
            <div className="catalog-tools">
              <p>
                <b>{pagination?.totalItems ?? results.length} courses</b> found
                for you
              </p>
              <div>
                <Grid2X2 size={17} />
                <select
                  aria-label="Sort courses"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  {[
                    "Recommended",
                    "Price: Low to high",
                    "Price: High to low",
                    "Rating: High to low",
                  ].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="empty">
                <h3>Finding great courses…</h3>
              </div>
            ) : loadError ? (
              <div className="empty">
                <h3>{loadError}</h3>
              </div>
            ) : results.length ? (
              <>
                <div className="course-grid">
                  {results.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                <Pagination pagination={pagination} onPageChange={setPage} />
              </>
            ) : (
              <div className="empty">
                <div>⌕</div>
                <h3>No courses found</h3>
                <p>
                  Try adjusting your search or filters to discover more courses.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setFilters(defaultFilters);
                    setPage(1);
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer>
        © 2025 Learniee · Made for brighter learning days <br />
        Made By Taha Ansari
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
