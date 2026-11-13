import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Auth/Welcome";
import StudentLayout from "./components/Layout/StudentLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import MyBatch from "./pages/Student/MyBatch/MyBatch";
import StudyMaterials from "./pages/Admin/StudyMaterial/StudyMaterials";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Welcome Page */}
        <Route path="/" element={<Welcome />} />
        {/* Student Dashboard */}
        <Route path="/student" element={<StudentLayout />}>
          <Route
            index
            element={<Navigate to="my-batch" replace />}
          />
          <Route path="my-batch" element={<MyBatch />} />
        </Route>
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="study-materials"
            element={<StudyMaterials />}
          />
        </Route>
        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;