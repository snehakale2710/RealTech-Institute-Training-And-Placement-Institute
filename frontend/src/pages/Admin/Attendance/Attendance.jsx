import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  ChevronRight,
  CircleCheck,
  CircleX,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import "./Attendance.css";

/* ---------------------------------------------------------
   DATA
   Replace these with your API response (fetch in useEffect)
--------------------------------------------------------- */

const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];
const ACADEMIC_YEARS = ["2026-27", "2025-26"];

const totals = { totalClasses: 60, present: 52, absent: 8 };

const monthly = [
  { month: "Jul", value: 78 },
  { month: "Aug", value: 82 },
  { month: "Sep", value: 88 },
  { month: "Oct", value: 80.7 },
  { month: "Nov", value: 86.7 },
];

const subjects = [
  { name: "Java Programming", value: 92 },
  { name: "Python Programming", value: 88 },
  { name: "Database Management", value: 75 },
  { name: "Web Development", value: 91 },
  { name: "Computer Networks", value: 82 },
];

const records = [
  { id: 1, date: "2026-11-14", subject: "Java Programming", type: "Theory", status: "Present", time: "10:00 AM" },
  { id: 2, date: "2026-11-13", subject: "Python Programming", type: "Lab", status: "Present", time: "11:00 AM" },
  { id: 3, date: "2026-11-12", subject: "Database Management", type: "Theory", status: "Absent", time: "09:00 AM" },
  { id: 4, date: "2026-11-11", subject: "Web Development", type: "Lab", status: "Present", time: "02:00 PM" },
  { id: 5, date: "2026-11-10", subject: "Computer Networks", type: "Theory", status: "Present", time: "11:00 AM" },
  { id: 6, date: "2026-10-08", subject: "Java Programming", type: "Theory", status: "Present", time: "10:00 AM" },
  { id: 7, date: "2026-10-07", subject: "Python Programming", type: "Lab", status: "Present", time: "11:00 AM" },
  { id: 8, date: "2026-10-06", subject: "Database Management", type: "Theory", status: "Absent", time: "09:00 AM" },
  { id: 9, date: "2026-10-05", subject: "Web Development", type: "Lab", status: "Present", time: "02:00 PM" },
  { id: 10, date: "2026-10-03", subject: "Computer Networks", type: "Theory", status: "Present", time: "11:00 AM" },
];

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const MIN_REQUIRED = 75; // below this = attendance shortage
const WARN_BELOW = 80; // below this = close to the limit

const STATUS_FILTERS = ["All", "Present", "Absent"];
const Y_TICKS = [100, 80, 60, 40, 20, 0];

const toDate = (iso) => new Date(`${iso}T00:00:00`);

const formatDate = (iso) =>
  toDate(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const monthKey = (iso) => iso.slice(0, 7);

const monthLabel = (key) =>
  toDate(`${key}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const levelFor = (value) => {
  if (value < MIN_REQUIRED) return "low";
  if (value < WARN_BELOW) return "warn";
  return "good";
};

/* ---------------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------------- */

function StatusBadge({ status }) {
  return (
    <span className={`att-status status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function ProgressRing({ value }) {
  const size = 56;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <svg
      className="progress-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <circle
        className="ring-track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        className="ring-value"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function SummaryCards({ overall, trend }) {
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <section className="att-summary" aria-label="Attendance summary">
      <div className="att-tile">
        <ProgressRing value={overall} />
        <div className="tile-text">
          <h3>{overall.toFixed(1)}%</h3>
          <p>Overall Attendance</p>
          <span className={`trend ${trend >= 0 ? "trend-up" : "trend-down"}`}>
            <TrendIcon size={14} aria-hidden="true" />
            {Math.abs(trend).toFixed(1)}% from last month
          </span>
        </div>
      </div>

      <div className="att-tile">
        <div className="tile-icon">
          <CalendarDays size={24} />
        </div>
        <div className="tile-text">
          <h3>{totals.totalClasses}</h3>
          <p>Total Classes</p>
          <span className="tile-note">This semester</span>
        </div>
      </div>

      <div className="att-tile">
        <div className="tile-icon tile-icon-green">
          <CircleCheck size={24} />
        </div>
        <div className="tile-text">
          <h3>{totals.present}</h3>
          <p>Classes Present</p>
        </div>
      </div>

      <div className="att-tile">
        <div className="tile-icon tile-icon-red">
          <CircleX size={24} />
        </div>
        <div className="tile-text">
          <h3>{totals.absent}</h3>
          <p>Classes Absent</p>
        </div>
      </div>
    </section>
  );
}

function OverviewChart() {
  return (
    <section className="att-card" aria-labelledby="overview-heading">
      <div className="card-heading">
        <span className="card-icon" aria-hidden="true">
          <ChartColumn size={20} />
        </span>
        <h2 id="overview-heading">Attendance Overview</h2>
      </div>

      <div className="chart">
        <div className="chart-y" aria-hidden="true">
          {Y_TICKS.map((t) => (
            <span key={t} style={{ "--v": t }}>
              {t}%
            </span>
          ))}
        </div>

        <div className="chart-main">
          <div
            className="chart-plot"
            role="img"
            aria-label={`Monthly attendance: ${monthly
              .map((m) => `${m.month} ${m.value}%`)
              .join(", ")}`}
          >
            {monthly.map((m) => (
              <div className="bar-col" key={m.month} style={{ "--v": m.value }}>
                <span className="bar-value">{m.value}%</span>
                <div className="bar" />
              </div>
            ))}
          </div>

          <div className="chart-x" aria-hidden="true">
            {monthly.map((m) => (
              <span key={m.month}>{m.month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubjectWise() {
  return (
    <section className="att-card" aria-labelledby="subjects-heading">
      <div className="card-heading">
        <span className="card-icon" aria-hidden="true">
          <BookOpen size={20} />
        </span>
        <h2 id="subjects-heading">Subject-wise Attendance</h2>
      </div>

      <ul className="subject-list">
        {subjects.map((s) => (
          <li key={s.name} className="subject-row">
            <span className="subject-name">{s.name}</span>
            <span className="subject-percent">{s.value}%</span>
            <div
              className={`subject-track level-${levelFor(s.value)}`}
              role="progressbar"
              aria-valuenow={s.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${s.name} attendance`}
            >
              <div className="subject-fill" style={{ width: `${s.value}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <p className="subject-note">
        Minimum required attendance is {MIN_REQUIRED}%.
      </p>
    </section>
  );
}

function RecordsTable({ list }) {
  const [subject, setSubject] = useState("All");
  const [status, setStatus] = useState("All");
  const [month, setMonth] = useState("All");
  const [query, setQuery] = useState("");

  const months = useMemo(
    () => [...new Set(list.map((r) => monthKey(r.date)))].sort().reverse(),
    [list]
  );

  const countFor = (f) =>
    f === "All" ? list.length : list.filter((r) => r.status === f).length;

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return list
      .filter(
        (r) =>
          (subject === "All" || r.subject === subject) &&
          (status === "All" || r.status === status) &&
          (month === "All" || monthKey(r.date) === month) &&
          r.subject.toLowerCase().includes(search)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [list, subject, status, month, query]);

  return (
    <section className="att-card records-card" aria-labelledby="records-heading">
      <div className="records-toolbar">
        <div className="card-heading no-margin">
          <span className="card-icon" aria-hidden="true">
            <CalendarCheck size={20} />
          </span>
          <h2 id="records-heading">Attendance Records</h2>
        </div>

        <div className="records-controls">
          <div className="att-filter-tabs" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className="att-filter-tab"
                aria-pressed={status === f}
                onClick={() => setStatus(f)}
              >
                {f}
                <span className="att-filter-count">{countFor(f)}</span>
              </button>
            ))}
          </div>

          <select
            className="att-select"
            aria-label="Filter by subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="All">All subjects</option>
            {subjects.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="att-select"
            aria-label="Filter by month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="All">All months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>

          <label className="att-table-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search subject"
              aria-label="Search subject"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="records-table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Subject</th>
              <th scope="col">Class Type</th>
              <th scope="col">Status</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>No records match your filters.</td>
              </tr>
            )}
            {visible.map((r) => (
              <tr key={r.id}>
                <td data-label="Date">
                  <span className="att-cell-main">{formatDate(r.date)}</span>
                </td>
                <td data-label="Subject">
                  <span className="att-cell-main">{r.subject}</span>
                </td>
                <td data-label="Class Type">{r.type}</td>
                <td data-label="Status">
                  <StatusBadge status={r.status} />
                </td>
                <td data-label="Time">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="att-table-footer" aria-live="polite">
        Showing {visible.length} of {list.length} records
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   PAGE
--------------------------------------------------------- */

function Attendance() {
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [year, setYear] = useState(ACADEMIC_YEARS[0]);

  const overall = (totals.present / totals.totalClasses) * 100;
  const trend = monthly[monthly.length - 1].value - monthly[monthly.length - 2].value;

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <nav className="att-breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight size={15} />
          <span aria-current="page">Attendance</span>
        </nav>

        <header className="att-page-header">
          <div className="att-header-text">
            <div className="att-title-row">
              <span className="att-title-icon" aria-hidden="true">
                <CalendarCheck size={26} strokeWidth={1.8} />
              </span>
              <h1>Attendance</h1>
            </div>
            <p>Track attendance by month, subject and class.</p>
          </div>

          <div className="att-header-filters">
            <select
              className="att-select"
              aria-label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {SEMESTERS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              className="att-select"
              aria-label="Academic year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y}>
                  Academic Year {y}
                </option>
              ))}
            </select>
          </div>
        </header>

        <SummaryCards overall={overall} trend={trend} />

        <div className="att-grid">
          <OverviewChart />
          <SubjectWise />
        </div>

        <RecordsTable list={records} />
      </div>
    </div>
  );
}

export default Attendance;