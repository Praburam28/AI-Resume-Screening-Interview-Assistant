import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  Loader2,
  Mail,
  MessageSquareText,
  Search,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const isHR = user?.role === "HR";

  const defaultAnalytics = {
    total_candidates: 0,
    total_job_descriptions: 0,
    total_evaluations: 0,
    average_match_score: 0,
    total_interview_question_sets: 0,
    total_candidate_summaries: 0,
  };

  const loadDashboard = async () => {
    setLoading(true);
    setNotice("");

    try {
      const [
        analyticsRes,
        recentRes,
        skillsRes,
        rankingRes,
        activeUsersRes,
      ] = await Promise.allSettled([
        api.get("/analytics/"),
        api.get("/analytics/recent-candidates?limit=5"),
        api.get("/analytics/most-requested-skills?limit=8"),
        api.get("/analytics/resume-ranking?limit=5"),
        api.get("/analytics/most-active-users?limit=5"),
      ]);

      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      } else {
        setAnalytics(defaultAnalytics);

        if (analyticsRes.reason?.response?.status === 403) {
          setNotice(
            "You are logged in as Recruiter. Some admin analytics are available only for HR users."
          );
        }
      }

      if (recentRes.status === "fulfilled") {
        setRecentCandidates(recentRes.value.data);
      }

      if (skillsRes.status === "fulfilled") {
        setSkills(skillsRes.value.data);
      }

      if (rankingRes.status === "fulfilled") {
        setRanking(rankingRes.value.data);
      }

      if (activeUsersRes.status === "fulfilled") {
        setActiveUsers(activeUsersRes.value.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const quickActions = useMemo(() => {
    const actions = [
      {
        title: "Upload Resume",
        description: "Add new candidate profile",
        path: "/upload-resume",
        icon: UploadCloud,
        roles: ["HR"],
      },
      {
        title: "Manage Candidates",
        description: "View extracted resumes",
        path: "/candidates",
        icon: Users,
      },
      {
        title: "Create Job",
        description: "Add hiring role",
        path: "/jobs",
        icon: BriefcaseBusiness,
        roles: ["HR"],
      },
      {
        title: "Run AI Match",
        description: "Compare candidate and job",
        path: "/ai-matching",
        icon: BrainCircuit,
      },
      {
        title: "Generate Questions",
        description: "Prepare interview set",
        path: "/questions",
        icon: MessageSquareText,
      },
      {
        title: "Search Candidates",
        description: "Use semantic filters",
        path: "/search",
        icon: FileSearch,
      },
      {
        title: "Invitations",
        description: "Send interview invites",
        path: "/invitations",
        icon: Mail,
      },
    ];

    return actions.filter((action) => {
      if (!action.roles) return true;
      return action.roles.includes(user?.role);
    });
  }, [user]);

  const getUserName = (item) => {
    return (
      item.full_name ||
      item.user_name ||
      item.name ||
      item.email ||
      `User #${item.user_id || item.id || ""}`
    );
  };

  const getUserEmail = (item) => {
    return item.email || "Email unavailable";
  };

  const getActivityCount = (item) => {
    return (
      item.activity_count ||
      item.total_activity ||
      item.total_actions ||
      item.count ||
      0
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Preparing dashboard insights...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {notice && <div className="info-alert">{notice}</div>}

      <div className="welcome-banner improved-banner">
        <div>
          <span>AI Hiring Command Center</span>
          <h2>
            Welcome back, {user?.full_name || "User"}. Make smarter hiring
            decisions today.
          </h2>
          <p>
            Track resume uploads, job descriptions, AI evaluations, candidate
            rankings, interview questions, invitations, and hiring summaries
            from one polished dashboard.
          </p>
        </div>

        <div className="banner-profile-card">
          <div className="banner-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h3>{user?.role || "User"}</h3>
            <p>
              {isHR
                ? "Full admin workspace access"
                : "Recruiter workspace access"}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Candidates"
          value={analytics?.total_candidates ?? 0}
          icon={Users}
          trend="Uploaded resumes"
          tone="blue"
        />

        <StatCard
          title="Job Descriptions"
          value={analytics?.total_job_descriptions ?? 0}
          icon={BriefcaseBusiness}
          trend="Active hiring roles"
          tone="purple"
        />

        <StatCard
          title="Average Match Score"
          value={`${analytics?.average_match_score ?? 0}%`}
          icon={TrendingUp}
          trend="AI suitability score"
          tone="green"
        />

        <StatCard
          title="AI Evaluations"
          value={analytics?.total_evaluations ?? 0}
          icon={BarChart3}
          trend="Resume-job matches"
          tone="orange"
        />

        <StatCard
          title="Question Sets"
          value={analytics?.total_interview_question_sets ?? 0}
          icon={MessageSquareText}
          trend="Generated interviews"
          tone="pink"
        />

        <StatCard
          title="Candidate Summaries"
          value={analytics?.total_candidate_summaries ?? 0}
          icon={FileText}
          trend="AI hiring reports"
          tone="cyan"
        />
      </div>

      <div className="dashboard-command-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Role-based shortcuts for your hiring workflow.</p>
            </div>
          </div>

          <div className="quick-action-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  to={action.path}
                  className="quick-action-card"
                  key={action.path}
                >
                  <div className="quick-action-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="panel role-insight-panel">
          <div className="role-insight-icon">
            <Sparkles size={34} />
          </div>

          <h3>{isHR ? "HR Control Mode" : "Recruiter Review Mode"}</h3>
          <p>
            {isHR
              ? "You can upload resumes, manage jobs, delete records, view admin analytics, and run AI workflows."
              : "You can review candidates, run AI matching, generate summaries, create interview questions, and check ranking insights."}
          </p>

          <Link to="/settings" className="action-button role-action-button">
            View Permissions
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Most Requested Skills</h3>
              <p>Skills frequently required in job descriptions.</p>
            </div>
          </div>

          {skills.length > 0 ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={skills}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="skill_name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="request_count" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              {isHR
                ? "No skill analytics yet. Create job descriptions to see skill demand."
                : "Skill analytics are available for HR users."}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Top Resume Ranking</h3>
              <p>Highest AI match scores from recent evaluations.</p>
            </div>
          </div>

          <div className="ranking-list">
            {ranking.length > 0 ? (
              ranking.map((item, index) => (
                <div className="ranking-item" key={item.evaluation_id || index}>
                  <div className="rank-number">{index + 1}</div>

                  <div className="rank-info">
                    <h4>{item.candidate_name || "Unnamed Candidate"}</h4>
                    <p>{item.job_title || "Job unavailable"}</p>
                  </div>

                  <div className="score-pill">{item.match_score || 0}%</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No ranking data yet. Run AI matching first.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Most Active Users</h3>
              <p>Users with the highest recruitment activity.</p>
            </div>
          </div>

          <div className="ranking-list">
            {activeUsers.length > 0 ? (
              activeUsers.map((item, index) => (
                <div
                  className="ranking-item"
                  key={item.user_id || item.id || index}
                >
                  <div className="rank-number">{index + 1}</div>

                  <div className="rank-info">
                    <h4>{getUserName(item)}</h4>
                    <p>{getUserEmail(item)}</p>
                  </div>

                  <div className="score-pill">{getActivityCount(item)}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No active user analytics available yet.
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Invitation Center</h3>
              <p>Send interview invitations to shortlisted candidates.</p>
            </div>
          </div>

          <div className="role-insight-panel invitation-mini-card">
            <div className="role-insight-icon">
              <Mail size={34} />
            </div>

            <h3>Schedule Candidate Interviews</h3>
            <p>
              Select a candidate, choose a job role, add schedule details, and
              send or draft an interview invitation.
            </p>

            <Link to="/invitations" className="action-button role-action-button">
              Open Invitations
            </Link>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header split-header">
          <div>
            <h3>Recent Candidate Uploads</h3>
            <p>Latest resumes uploaded to the system.</p>
          </div>

          <Link to="/search" className="small-search-link">
            <Search size={16} />
            Search Candidates
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Resume</th>
              </tr>
            </thead>

            <tbody>
              {recentCandidates.length > 0 ? (
                recentCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.name || "Not extracted"}</td>
                    <td>{candidate.email || "Not found"}</td>
                    <td>{candidate.phone || "Not found"}</td>
                    <td>{candidate.total_experience || "Not found"}</td>
                    <td>{candidate.resume_file_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      No candidates uploaded yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;