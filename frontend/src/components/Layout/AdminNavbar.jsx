
import { useLocation } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

import "./AdminNavbar.css";

function AdminNavbar() {
  const location = useLocation();

  const pageTitles = {
    "/admin/study-materials": "Study Materials",
    "/admin/dashboard": "Dashboard",
    "/admin/students": "Students",
    "/admin/courses": "Courses",
    "/admin/batches": "Batches",
    "/admin/attendance": "Attendance",
    "/admin/assignments": "Assignments",
    "/admin/results": "Results",
    "/admin/trainers": "Trainers",
    "/admin/settings": "Settings",
  };

  return (
    <header className="admin-navbar">

      <div className="admin-navbar-left">
        <h3>{pageTitles[location.pathname] || "Admin Panel"}</h3>
        <span>Welcome to Real Tech Institute</span>
      </div>

      <div className="admin-navbar-right">

        <button className="navbar-icon-btn" title="Search">
          <Search size={18} />
        </button>

        <button className="navbar-icon-btn notification-btn" title="Notifications">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="navbar-profile-avatar">A</div>

          <div className="navbar-profile-info">
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

          <ChevronDown size={16} />
        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;
