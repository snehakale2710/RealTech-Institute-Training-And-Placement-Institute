
import { Search, Bell, ChevronDown } from "lucide-react";

import "./StudentNavbar.css";

function StudentNavbar() {
  return (
    <header className="student-navbar">
      <div className="navbar-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search classes, teachers, materials..."
        />
      </div>

      <div className="navbar-right">
        <button
          className="navbar-notification"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">VS</div>

          <div className="navbar-profile-info">
            <h4>Vaishnavi Sirsale</h4>
            <p>Student</p>
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default StudentNavbar;
