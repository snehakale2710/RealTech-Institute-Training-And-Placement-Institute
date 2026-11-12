
import { Outlet } from "react-router-dom";

import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

import "./StudentLayout.css";

function StudentLayout() {
  return (
    <div className="student-app-layout">
      <StudentSidebar />

      <div className="student-main-area">
        <StudentNavbar />

        <main className="student-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
