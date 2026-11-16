import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import StudentLayout from "./components/Layout/StudentLayout";
import AdminLayout from "./components/Layout/AdminLayout";

/* Auth */
import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";

/* Student pages */
import StudentDashboard from "./pages/Student/Dashboard/Dashboard";
import StudentProfile from "./pages/Student/MyProfile/MyProfile";
import StudentCourses from "./pages/Student/MyCourses/MyCourses";
import MyBatch from "./pages/Student/MyBatch/MyBatch";
import StudentFees from "./pages/Student/Fees/Fees";
import StudentStudyMaterial from "./pages/Student/StudyMaterial/StudyMaterial";
import StudentAssignments from "./pages/Student/Assignments/Assignments";
import StudentNotifications from "./pages/Student/Notifications/Notifications";

/* Admin pages */
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminStudents from "./pages/Admin/Students/Students";
import AdminCourses from "./pages/Admin/Courses/Courses";
import AdminBatches from "./pages/Admin/Batches/Batches";
import AdminAttendance from "./pages/Admin/Attendance/Attendance";
import AdminStudyMaterials from "./pages/Admin/StudyMaterial/StudyMaterials";
import AdminAssignments from "./pages/Admin/Assignments/Assignments";
import AdminFees from "./pages/Admin/Fees/Fees";
import AdminNotifications from "./pages/Admin/Notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Student portal */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="my-batch" element={<MyBatch />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="study-material" element={<StudentStudyMaterial />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* Admin portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="batches" element={<AdminBatches />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="study-materials" element={<AdminStudyMaterials />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;