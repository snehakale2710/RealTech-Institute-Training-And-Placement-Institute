
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  ClipboardCheck,
  FileText,
  ClipboardList,
  GraduationCap,
  UserRound,
  Settings,
} from "lucide-react";

import "./AdminSidebar.css";

function AdminSidebar() {
  const menuGroups = [
    {
      title: "MAIN MENU",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Students", path: "/admin/students", icon: Users },
        { name: "Courses", path: "/admin/courses", icon: BookOpen },
        { name: "Batches", path: "/admin/batches", icon: Layers },
      ],
    },
    {
      title: "ACADEMIC",
      items: [
        { name: "Attendance", path: "/admin/attendance", icon: ClipboardCheck },
        { name: "Study Materials", path: "/admin/study-materials", icon: FileText },
        { name: "Assignments", path: "/admin/assignments", icon: ClipboardList },
        { name: "Results", path: "/admin/results", icon: GraduationCap },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Trainers", path: "/admin/trainers", icon: UserRound },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-logo">
        <div className="admin-logo-icon">R</div>

        <div className="admin-logo-text">
          <h3>REAL TECH</h3>
          <span>Training Institute</span>
        </div>
      </div>

      <nav className="admin-sidebar-menu">

        {menuGroups.map((group) => (
          <div key={group.title}>

            <p className="sidebar-section-title">
              {group.title}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-menu-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

          </div>
        ))}

      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-avatar">A</div>

        <div className="admin-sidebar-user">
          <h4>Administrator</h4>
          <p>Admin Account</p>
        </div>
      </div>

    </aside>
  );
}

export default AdminSidebar;
