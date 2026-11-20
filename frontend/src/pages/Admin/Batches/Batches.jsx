import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BookOpen,
  CircleCheck,
  EllipsisVertical,
  Eye,
  Layers,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Batches.css";

/* ---------------------------------------------------------
   DATA
   Replace this with your API response (fetch in useEffect).
   The summary tiles are calculated from this list.
--------------------------------------------------------- */

const COURSES = ["BCA", "B.Tech", "B.Com", "MCA"];

const COURSE_COLORS = {
  BCA: "#ff6a00",
  "B.Tech": "#1f7cf5",
  "B.Com": "#12994a",
  MCA: "#8a3ffc",
};

const initialBatches = [
  { id: 1, name: "BCA-01", code: "BCA-01", course: "BCA", students: 32, timing: "09:00 AM - 11:00 AM", days: "Mon - Fri", status: "Active", color: "#ff6a00" },
  { id: 2, name: "BCA-02", code: "BCA-02", course: "BCA", students: 30, timing: "11:30 AM - 01:30 PM", days: "Mon - Fri", status: "Active", color: "#a64dff" },
  { id: 3, name: "B.Tech-01", code: "BT-01", course: "B.Tech", students: 28, timing: "09:00 AM - 11:00 AM", days: "Mon - Fri", status: "Active", color: "#1f7cf5" },
  { id: 4, name: "B.Tech-02", code: "BT-02", course: "B.Tech", students: 26, timing: "11:30 AM - 01:30 PM", days: "Mon - Fri", status: "Active", color: "#ff1493" },
  { id: 5, name: "B.Com-01", code: "BC-01", course: "B.Com", students: 24, timing: "09:00 AM - 11:00 AM", days: "Mon - Fri", status: "Active", color: "#12994a" },
  { id: 6, name: "B.Com-02", code: "BC-02", course: "B.Com", students: 22, timing: "11:30 AM - 01:30 PM", days: "Mon - Fri", status: "Active", color: "#f5c400" },
  { id: 7, name: "MCA-01", code: "MCA-01", course: "MCA", students: 18, timing: "02:00 PM - 04:00 PM", days: "Mon - Fri", status: "Inactive", color: "#8a3ffc" },
  { id: 8, name: "MCA-02", code: "MCA-02", course: "MCA", students: 15, timing: "09:00 AM - 12:00 PM", days: "Sat - Sun", status: "Active", color: "#1f7cf5" },
];

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const PAGE_SIZE = 8;

const COLUMNS = [
  { key: "name", label: "Batch Name / Code", sortable: true },
  { key: "course", label: "Course", sortable: true },
  { key: "students", label: "Students", sortable: true },
  { key: "timing", label: "Batch Timing", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions" },
];

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }),
  course: (a, b) => a.course.localeCompare(b.course),
  students: (a, b) => a.students - b.students,
  timing: (a, b) => a.timing.localeCompare(b.timing),
  status: (a, b) => a.status.localeCompare(b.status),
};

const EMPTY_FORM = {
  name: "",
  code: "",
  course: COURSES[0],
  students: 0,
  timing: "09:00 AM - 11:00 AM",
  days: "Mon - Fri",
  status: "Active",
};

/* ---------------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------------- */

function SortIcon({ active, dir }) {
  if (!active) return <ArrowUpDown size={13} aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp size={13} aria-hidden="true" />
  ) : (
    <ArrowDown size={13} aria-hidden="true" />
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`bt-status bt-status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function SummaryTiles({ list }) {
  const total = list.length;
  const active = list.filter((b) => b.status === "Active").length;
  const students = list.reduce((sum, b) => sum + b.students, 0);
  const courses = new Set(list.map((b) => b.course)).size;

  const tiles = [
    { Icon: Layers, value: total, title: "Total Batches", note: "Across all courses" },
    { Icon: CircleCheck, value: active, title: "Active Batches", note: "Currently running", tone: "green" },
    { Icon: Users, value: students, title: "Assigned Students", note: "Across all batches", tone: "blue" },
    { Icon: BookOpen, value: courses, title: "Courses with Batches", note: "Courses assigned", tone: "purple" },
  ];

  return (
    <section className="bt-summary" aria-label="Batch summary">
      {tiles.map(({ Icon, value, title, note, tone }) => (
        <div className="bt-tile" key={title}>
          <div className={`bt-tile-icon ${tone ? `tone-${tone}` : ""}`}>
            <Icon size={24} />
          </div>
          <div className="bt-tile-text">
            <h3>{value}</h3>
            <p className="bt-tile-title">{title}</p>
            <span className="bt-tile-note">{note}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function RowMenu({ item, open, onToggle, onStatus, onDelete }) {
  return (
    <div className="bt-menu-wrap" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="bt-icon-btn"
        aria-label={`More actions for ${item.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="bt-menu" role="menu">
          <button type="button" role="menuitem" onClick={onStatus}>
            {item.status === "Active" ? "Mark as inactive" : "Mark as active"}
          </button>
          <button
            type="button"
            role="menuitem"
            className="bt-menu-danger"
            onClick={onDelete}
          >
            Delete batch
          </button>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="bt-modal-overlay" onClick={onClose}>
      <div
        className="bt-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bt-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="bt-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BatchDetails({ item, onClose }) {
  return (
    <Modal title={item.name} onClose={onClose}>
      <dl className="bt-details">
        <div><dt>Batch code</dt><dd>{item.code}</dd></div>
        <div><dt>Course</dt><dd>{item.course}</dd></div>
        <div><dt>Students</dt><dd>{item.students}</dd></div>
        <div><dt>Timing</dt><dd>{item.timing}</dd></div>
        <div><dt>Days</dt><dd>{item.days}</dd></div>
        <div><dt>Status</dt><dd><StatusBadge status={item.status} /></dd></div>
      </dl>
    </Modal>
  );
}

function BatchForm({ initial, onSave, onClose }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError("Enter a batch name and a batch code.");
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      code: form.code.trim(),
      students: Math.max(0, Number(form.students) || 0),
    });
  };

  return (
    <Modal title={isEdit ? "Edit batch" : "Create batch"} onClose={onClose}>
      <form className="bt-form" onSubmit={submit} noValidate>
        <label>
          Batch name
          <input name="name" value={form.name} onChange={change} placeholder="e.g. BCA-03" autoFocus />
        </label>
        <label>
          Batch code
          <input name="code" value={form.code} onChange={change} placeholder="e.g. BCA-03" />
        </label>
        <label>
          Course
          <select name="course" value={form.course} onChange={change}>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Students
          <input name="students" type="number" min="0" value={form.students} onChange={change} />
        </label>
        <label>
          Batch timing
          <input name="timing" value={form.timing} onChange={change} />
        </label>
        <label>
          Days
          <input name="days" value={form.days} onChange={change} />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>

        {error && <p className="bt-form-error" role="alert">{error}</p>}

        <div className="bt-form-actions">
          <button type="button" className="bt-btn bt-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bt-btn">
            {isEdit ? "Save changes" : "Create batch"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------
   PAGE
--------------------------------------------------------- */

function Batches() {
  const [batches, setBatches] = useState(initialBatches);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null); // batch object, or "new"
  const [menuId, setMenuId] = useState(null);

  // close the "more" menu when clicking anywhere else
  useEffect(() => {
    if (menuId === null) return undefined;
    const close = () => setMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = batches.filter(
      (b) =>
        (course === "All" || b.course === course) &&
        (status === "All" || b.status === status) &&
        (b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q))
    );
    if (!sort.key) return filtered;
    const sorted = [...filtered].sort(SORTERS[sort.key]);
    return sort.dir === "desc" ? sorted.reverse() : sorted;
  }, [batches, search, course, status, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = visible.slice(start, start + PAGE_SIZE);

  /* Click once = ascending, again = descending, third click = original order */
  const toggleSort = (key) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });

  const ariaSort = (col) => {
    if (!col.sortable) return undefined;
    if (sort.key !== col.key) return "none";
    return sort.dir === "asc" ? "ascending" : "descending";
  };

  const resetFilters = () => {
    setSearch("");
    setCourse("All");
    setStatus("All");
    setSort({ key: null, dir: "asc" });
    setPage(1);
  };

  const saveBatch = (data) => {
    if (editing && editing !== "new") {
      setBatches((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...data } : b))
      );
    } else {
      setBatches((prev) => [
        ...prev,
        { ...data, id: Date.now(), color: COURSE_COLORS[data.course] || "#ff6a00" },
      ]);
    }
    setEditing(null);
  };

  const toggleStatus = (id) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" }
          : b
      )
    );
    setMenuId(null);
  };

  const deleteBatch = (item) => {
    setMenuId(null);
    if (window.confirm(`Delete ${item.name}? This cannot be undone.`)) {
      setBatches((prev) => prev.filter((b) => b.id !== item.id));
    }
  };

  const showingFrom = visible.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, visible.length);

  return (
    <div className="batches-page">
      <div className="batches-container">
        {/* Header */}
        <header className="bt-page-header">
          <div className="bt-title-row">
            <span className="bt-title-icon" aria-hidden="true">
              <Layers size={30} strokeWidth={1.8} />
            </span>
            <div className="bt-title-text">
              <h1>Batches</h1>
              <p>Manage and organize all batches, student allocations, schedules and courses.</p>
            </div>
          </div>

          <button type="button" className="bt-btn" onClick={() => setEditing("new")}>
            <Plus size={18} />
            Create Batch
          </button>
        </header>

        <SummaryTiles list={batches} />

        {/* Table card */}
        <section className="bt-card" aria-label="All batches">
          <div className="bt-toolbar">
            <label className="bt-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search by batch name or code"
                aria-label="Search batches"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>

            <select
              className="bt-select"
              aria-label="Filter by course"
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All courses</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="bt-select"
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button type="button" className="bt-reset" onClick={resetFilters}>
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="bt-table-wrapper">
            <table className="bt-table">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.key} scope="col" aria-sort={ariaSort(col)}>
                      {col.sortable ? (
                        <button
                          type="button"
                          className="bt-sort"
                          onClick={() => toggleSort(col.key)}
                        >
                          {col.label}
                          <SortIcon active={sort.key === col.key} dir={sort.dir} />
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 && (
                  <tr className="bt-empty-row">
                    <td colSpan={COLUMNS.length}>No batches match your filters.</td>
                  </tr>
                )}

                {rows.map((b) => (
                  <tr key={b.id}>
                    <td data-label="Batch">
                      <div className="bt-batch-cell">
                        <Layers size={30} strokeWidth={2} style={{ color: b.color }} aria-hidden="true" />
                        <div>
                          <span className="bt-main">{b.name}</span>
                          <span className="bt-sub">{b.code}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Course">
                      <span className="bt-course">{b.course}</span>
                    </td>
                    <td data-label="Students">
                      <span className="bt-main">{b.students}</span>
                      <span className="bt-sub">students</span>
                    </td>
                    <td data-label="Timing">
                      <span className="bt-main bt-main-light">{b.timing}</span>
                      <span className="bt-sub">{b.days}</span>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={b.status} />
                    </td>
                    <td data-label="Actions">
                      <div className="bt-actions">
                        <button
                          type="button"
                          className="bt-icon-btn"
                          aria-label={`View ${b.name}`}
                          title="View"
                          onClick={() => setViewing(b)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          className="bt-icon-btn"
                          aria-label={`Edit ${b.name}`}
                          title="Edit"
                          onClick={() => setEditing(b)}
                        >
                          <Pencil size={17} />
                        </button>
                        <RowMenu
                          item={b}
                          open={menuId === b.id}
                          onToggle={() => setMenuId(menuId === b.id ? null : b.id)}
                          onStatus={() => toggleStatus(b.id)}
                          onDelete={() => deleteBatch(b)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <div className="bt-footer">
          <p aria-live="polite">
            Showing {showingFrom} to {showingTo} of {visible.length} batches
          </p>

          <div className="bt-pagination">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={safePage === i + 1 ? "active" : ""}
                aria-current={safePage === i + 1 ? "page" : undefined}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewing && <BatchDetails item={viewing} onClose={() => setViewing(null)} />}

      {editing && (
        <BatchForm
          initial={editing === "new" ? null : editing}
          onSave={saveBatch}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

export default Batches;