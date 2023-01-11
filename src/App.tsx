import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import RequireAuth from "./pages/Protected";
import Authentication from "./pages/Login";
import Signup from "./pages/SignUp";
import Participants from "./pages/Participants";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Authentication />} />
        <Route path="/signup" element={<Signup />} />
        <Route index element={
          <RequireAuth>
            <Participants />
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to={"/"} replace={true} />} />
      </Routes>
    </Router>
  );
}
