
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Users,
  CalendarDays,
  CreditCard,
  BookOpen,
  Bell,
  LogOut,
} from "lucide-react";

import "./StudentSidebar.css";

function StudentSidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", path: "/profile", icon: User },
    { name: "My Courses", path: "/courses", icon: GraduationCap },
    { name: "My Batches", path: "/my-batch", icon: Users },
    { name: "Attendance", path: "/attendance", icon: CalendarDays },
    { name: "Fees", path: "/fees", icon: CreditCard },
    { name: "Study Material", path: "/study-material", icon: BookOpen },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  return (
    <aside className="student-sidebar">
      <div className="sidebar-logo">
        <div className="logo-symbol">R</div>
        <h2>REAL-TECH</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">VS</div>
          <div className="sidebar-user-info">
            <h4>Vaishnavi Sirsale</h4>
            <p>Student</p>
          </div>
        </div>

        <NavLink to="/login" className="sidebar-link logout-link">
          <LogOut size={19} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default StudentSidebar;
