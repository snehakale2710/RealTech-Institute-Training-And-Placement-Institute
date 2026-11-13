import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Database,
  ExternalLink,
  GraduationCap,
  Globe,
  Link as LinkIcon,
  Search,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";

import "./MyBatch.css";

/* ---------------------------------------------------------
   DATA
   Replace these with your API response (fetch in useEffect)
--------------------------------------------------------- */

const batchInfo = {
  title: "Data Analyst",
  batch: "Batch 01",
  course: "Data Analysis Using AI",
  status: "Active",
  classDays: "Mon, Wed, Fri",
  totalStudents: 45,
};

const classes = [
  {
    id: 1,
    name: "Python Programming",
    batch: "Batch 01",
    classNo: "Class 1",
    days: "Mon, Wed, Fri",
    time: "10:00 AM - 11:00 AM",
    platform: "Google Meet",
    link: "https://meet.google.com/ibc-vbdi-cfv",
    status: "Ongoing",
    icon: "code",
    instructor: "Course Instructor",
    session: 5,
    totalSessions: 12,
  },
  {
    id: 2,
    name: "Web Development",
    batch: "Batch 01",
    classNo: "Class 2",
    days: "Tue, Thu",
    time: "02:00 PM - 03:00 PM",
    platform: "Zoom",
    link: "https://zoom.us/j/123456789",
    status: "Upcoming",
    icon: "web",
    instructor: "Course Instructor",
    session: 3,
    totalSessions: 10,
  },
  {
    id: 3,
    name: "Database Management",
    batch: "Batch 01",
    classNo: "Class 3",
    days: "Mon, Wed",
    time: "04:00 PM - 05:00 PM",
    platform: "Google Meet",
    link: "https://meet.google.com/gdv-hdbh-vgb",
    status: "Upcoming",
    icon: "database",
    instructor: "Course Instructor",
    session: 2,
    totalSessions: 8,
  },
  {
    id: 4,
    name: "Data Structures & Algorithm",
    batch: "Batch 01",
    classNo: "Class 4",
    days: "Fri",
    time: "11:00 AM - 12:00 PM",
    platform: "Microsoft Teams",
    link: "https://teams.microsoft.com/abc123",
    status: "Completed",
    icon: "code",
    instructor: "Course Instructor",
    session: 8,
    totalSessions: 8,
  },
  {
    id: 5,
    name: "Soft Skills & Aptitude",
    batch: "Batch 01",
    classNo: "Class 5",
    days: "Sat",
    time: "10:00 AM - 11:00 AM",
    platform: "Google Meet",
    link: "https://meet.google.com/ivq-fghj-vgb",
    status: "Completed",
    icon: "settings",
    instructor: "Course Instructor",
    session: 6,
    totalSessions: 6,
  },
];

/* ---------------------------------------------------------
   LOOKUPS & HELPERS
--------------------------------------------------------- */

const COURSE_ICONS = {
  code: Code,
  web: Globe,
  database: Database,
  settings: Settings,
};

const PLATFORMS = {
  "Google Meet": { Icon: Video, className: "platform-meet" },
  Zoom: { Icon: Video, className: "platform-zoom" },
  "Microsoft Teams": { Icon: Users, className: "platform-teams" },
};

const getPlatform = (name) =>
  PLATFORMS[name] || { Icon: Video, className: "platform-meet" };

const STATUS_ORDER = { Ongoing: 0, Upcoming: 1, Completed: 2 };

/* Table columns. `sortable` columns get a sort button in the header. */
const COLUMNS = [
  { key: "name", label: "Course / Class Name", sortable: true },
  { key: "batch", label: "Batch", sortable: true },
  { key: "schedule", label: "Schedule" },
  { key: "platform", label: "Platform", sortable: true },
  { key: "link", label: "Meeting Link" },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action" },
];

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  batch: (a, b) =>
    a.batch.localeCompare(b.batch, undefined, { numeric: true }) ||
    a.classNo.localeCompare(b.classNo, undefined, { numeric: true }),
  platform: (a, b) => a.platform.localeCompare(b.platform),
  status: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
};

/* Only allow http/https links (protects against javascript: URLs
   once links start coming from the database). */
const isSafeUrl = (url) => /^https?:\/\//i.test(url);

const formatToday = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const joinClass = (link) => {
  if (!isSafeUrl(link)) return;
  window.open(link, "_blank", "noopener,noreferrer");
};

/* Today's class = the one running now, otherwise the next upcoming */
const pickTodayClass = (list) =>
  list.find((c) => c.status === "Ongoing") ||
  list.find((c) => c.status === "Upcoming") ||
  null;

function useCopyLink() {
  const [copied, setCopied] = useState("");

  const copy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(link);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.prompt("Copy this meeting link:", link);
    }
  };

  return [copied, copy];
}

/* ---------------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------------- */

function CopyButton({ link, copied, onCopy, label }) {
  return (
    <button
      type="button"
      className="copy-link-button"
      onClick={() => onCopy(link)}
      aria-label={label}
      title={label}
    >
      {copied === link ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`class-status status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function SummaryCard({ info }) {
  return (
    <section className="batch-summary-card" aria-label="Batch summary">
      <div className="batch-summary-item">
        <div className="summary-icon">
          <BookOpen size={24} strokeWidth={1.8} />
        </div>
        <div className="summary-text">
          <h3>{info.title}</h3>
          <p>
            {info.batch} &middot; {info.course}
          </p>
        </div>
      </div>

      <div className="batch-summary-item">
        <div className="summary-icon">
          <Activity size={24} />
        </div>
        <div className="summary-text">
          <h3>
            <span className="active-badge">{info.status}</span>
          </h3>
          <p>Batch Status</p>
        </div>
      </div>

      <div className="batch-summary-item">
        <div className="summary-icon">
          <CalendarDays size={24} />
        </div>
        <div className="summary-text">
          <h3>{info.classDays}</h3>
          <p>Class Days</p>
        </div>
      </div>

      <div className="batch-summary-item">
        <div className="summary-icon">
          <Users size={24} />
        </div>
        <div className="summary-text">
          <h3>{info.totalStudents}</h3>
          <p>Total Students</p>
        </div>
      </div>
    </section>
  );
}

function TodayClass({ item, copied, onCopy }) {
  const [showDetails, setShowDetails] = useState(false);
  const { Icon: PlatformIcon } = item
    ? getPlatform(item.platform)
    : { Icon: Video };

  return (
    <section className="today-class-card" aria-labelledby="today-heading">
      <div className="today-class-heading">
        <h2 id="today-heading">Today&rsquo;s Online Class</h2>
        <div className="today-class-date">
          <CalendarDays size={18} />
          <span>{formatToday()}</span>
        </div>
      </div>

      {!item ? (
        <div className="empty-state">
          <p>No online class scheduled for today.</p>
        </div>
      ) : (
        <>
          <div className="today-class-content">
            <div className="today-session">
              <div className="icon-circle">
                <Clock size={40} strokeWidth={1.6} />
              </div>
              <div className="today-info">
                <h3>{item.time}</h3>
                <p>{item.name}</p>
                <span className="session-count">
                  Session {item.session}/{item.totalSessions}
                </span>
              </div>
            </div>

            <div className="today-meeting">
              <div className="icon-circle">
                <PlatformIcon size={36} />
              </div>
              <div className="today-info">
                <h3>{item.platform}</h3>
                <p>Online Meeting</p>
                <div className="meeting-link">
                  <LinkIcon size={13} />
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    title={item.link}
                  >
                    {item.link}
                  </a>
                  <CopyButton
                    link={item.link}
                    copied={copied}
                    onCopy={onCopy}
                    label="Copy meeting link"
                  />
                </div>
              </div>
            </div>

            <div className="today-class-actions">
              <button
                type="button"
                className="join-class-button"
                onClick={() => joinClass(item.link)}
              >
                Join Class <ExternalLink size={17} />
              </button>
              <button
                type="button"
                className="view-details-button"
                onClick={() => setShowDetails((prev) => !prev)}
                aria-expanded={showDetails}
                aria-controls="today-details"
              >
                View Details
                <ChevronDown
                  size={20}
                  className={showDetails ? "chevron-rotated" : ""}
                />
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="today-extra-details" id="today-details">
              <div>
                <strong>Course</strong>
                {item.name}
              </div>
              <div>
                <strong>Instructor</strong>
                {item.instructor}
              </div>
              <div>
                <strong>Session</strong>
                {item.session} of {item.totalSessions}
              </div>
              <div>
                <strong>Mode</strong>
                Online
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

const FILTERS = ["All", "Ongoing", "Upcoming", "Completed"];

function SortIcon({ active, dir }) {
  if (!active) return <ArrowUpDown size={13} aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp size={13} aria-hidden="true" />
  ) : (
    <ArrowDown size={13} aria-hidden="true" />
  );
}

function ClassesTable({ list, copied, onCopy, onView }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const countFor = (f) =>
    f === "All" ? list.length : list.filter((c) => c.status === f).length;
  /* Click once = ascending, again = descending, third click = original order */
  const toggleSort = (key) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });
  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = list.filter(
      (c) =>
        (filter === "All" || c.status === filter) &&
        c.name.toLowerCase().includes(search)
    );
    if (!sort.key) return filtered;
    const sorted = [...filtered].sort(SORTERS[sort.key]);
    return sort.dir === "desc" ? sorted.reverse() : sorted;
  }, [list, filter, query, sort]);
  const ariaSort = (col) => {
    if (!col.sortable) return undefined;
    if (sort.key !== col.key) return "none";
    return sort.dir === "asc" ? "ascending" : "descending";
  };
  return (
    <section className="classes-schedule-section" aria-labelledby="classes-heading">
      <div className="classes-toolbar">
        <h2 id="classes-heading">My Classes &amp; Schedule</h2>
        <div className="classes-controls">
          <div className="filter-tabs" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className="filter-tab"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="filter-count">{countFor(f)}</span>
              </button>
            ))}
          </div>
          <label className="table-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search classes"
              aria-label="Search classes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="classes-table-wrapper">
        <table className="classes-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} scope="col" aria-sort={ariaSort(col)}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className="sort-button"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      <SortIcon
                        active={sort.key === col.key}
                        dir={sort.dir}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr className="empty-row">
                <td colSpan={COLUMNS.length}>No classes match your filters.</td>
              </tr>
            )}
            {visible.map((item) => {
              const CourseIcon = COURSE_ICONS[item.icon] || BookOpen;
              const { Icon: PlatformIcon, className } = getPlatform(item.platform);
              return (
                <tr key={item.id}>
                  <td data-label="Course">
                    <div className="course-name-cell">
                      <div className="course-small-icon">
                        <CourseIcon size={18} />
                      </div>
                      <div>
                        <span className="cell-main">{item.name}</span>
                        <span className="cell-sub">Live Interactive Session</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Batch">
                    <span className="cell-main">{item.batch}</span>
                    <span className="cell-sub">{item.classNo}</span>
                  </td>
                  <td data-label="Schedule">
                    <span className="cell-main">{item.days}</span>
                    <span className="cell-sub">{item.time}</span>
                  </td>
                  <td data-label="Platform">
                    <div className="platform-name">
                      <span className={`platform-icon ${className}`}>
                        <PlatformIcon size={15} />
                      </span>
                      {item.platform}
                    </div>
                  </td>
                  <td data-label="Meeting Link">
                    <div className="table-meeting-link">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        title={item.link}
                      >
                        {item.link}
                      </a>
                      <CopyButton
                        link={item.link}
                        copied={copied}
                        onCopy={onCopy}
                        label={`Copy ${item.name} meeting link`}
                      />
                    </div>
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={item.status} />
                  </td>
                  <td data-label="Action">
                    {item.status === "Ongoing" ? (
                      <button
                        type="button"
                        className="table-join-button"
                        onClick={() => joinClass(item.link)}
                      >
                        Join Now <ExternalLink size={13} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="table-view-button"
                        onClick={() => onView(item)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-footer" aria-live="polite">
        Showing {visible.length} of {list.length} classes
      </div>
    </section>
  );
}
function ClassDetailsModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title">{item.name}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>
        <dl className="modal-list">
          <div>
            <dt>Batch</dt>
            <dd>
              {item.batch} &middot; {item.classNo}
            </dd>
          </div>
          <div>
            <dt>Schedule</dt>
            <dd>
              {item.days}, {item.time}
            </dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{item.platform}</dd>
          </div>
          <div>
            <dt>Instructor</dt>
            <dd>{item.instructor}</dd>
          </div>
          <div>
            <dt>Progress</dt>
            <dd>
              Session {item.session} of {item.totalSessions}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={item.status} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
/* ---------------------------------------------------------
   PAGE
--------------------------------------------------------- */
function MyBatch() {
  const [copied, copyLink] = useCopyLink();
  const [selectedClass, setSelectedClass] = useState(null);
  const todayClass = pickTodayClass(classes);
  return (
    <div className="my-batch-page">
      <div className="batch-container">
        <nav className="batch-breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight size={15} />
          <span aria-current="page">My Batch</span>
        </nav>
        <header className="batch-page-header">
          <div className="batch-title-row">
            <span className="batch-title-icon" aria-hidden="true">
              <GraduationCap size={26} strokeWidth={1.8} />
            </span>
            <h1>My Batch</h1>
          </div>
          <p>
            View your assigned class and batch details, including schedule,
            platform, and course information.
          </p>
        </header>
        <SummaryCard info={batchInfo} />
        <div className="batch-grid">
          <div className="batch-side">
            <TodayClass item={todayClass} copied={copied} onCopy={copyLink} />
          </div>
          <div className="batch-main">
            <ClassesTable
              list={classes}
              copied={copied}
              onCopy={copyLink}
              onView={setSelectedClass}
            />
          </div>
        </div>
      </div>
      <ClassDetailsModal
        item={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  );
}
export default MyBatch;