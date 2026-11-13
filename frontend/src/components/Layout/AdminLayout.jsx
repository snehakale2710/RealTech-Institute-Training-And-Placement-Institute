
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-app-layout">

      <AdminSidebar />

      <div className="admin-main-area">

        <AdminNavbar />

        <main className="admin-page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;
