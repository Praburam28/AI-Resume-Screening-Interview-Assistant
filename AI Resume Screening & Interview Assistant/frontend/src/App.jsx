import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Candidates from "./pages/Candidates";
import UploadResume from "./pages/UploadResume";
import CandidateDetails from "./pages/CandidateDetails";
import Jobs from "./pages/Jobs";
import AIMatching from "./pages/AIMatching";
import InterviewQuestions from "./pages/InterviewQuestions";
import CandidateSummary from "./pages/CandidateSummary";
import Evaluations from "./pages/Evaluations";
import ResumeRanking from "./pages/ResumeRanking";
import CandidateSearch from "./pages/CandidateSearch";
import Settings from "./pages/Settings";
import InterviewInvitations from "./pages/InterviewInvitations";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/:id" element={<CandidateDetails />} />
        <Route path="upload-resume" element={<UploadResume />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="ai-matching" element={<AIMatching />} />
        <Route path="questions" element={<InterviewQuestions />} />
        <Route path="summary" element={<CandidateSummary />} />
        <Route path="evaluations" element={<Evaluations />} />
        <Route path="ranking" element={<ResumeRanking />} />
        <Route path="search" element={<CandidateSearch />} />
        <Route path="settings" element={<Settings />} />
	<Route path="invitations" element={<InterviewInvitations />} />
      </Route>
    </Routes>
  );
}

export default App;
