
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "./components/Layout/StudentLayout";
import MyBatch from "./pages/Student/MyBatch/MyBatch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLayout />}>
          <Route
            index
            element={<Navigate to="/my-batch" replace />}
          />

          <Route path="my-batch" element={<MyBatch />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/my-batch" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
