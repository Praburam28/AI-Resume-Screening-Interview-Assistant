import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareText,
  Settings,
  UploadCloud,
  Users,
  Mail,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Candidates", path: "/candidates", icon: Users },
  {
    title: "Upload Resume",
    path: "/upload-resume",
    icon: UploadCloud,
    allowedRoles: ["HR"],
  },
  { title: "Jobs", path: "/jobs", icon: BriefcaseBusiness },
  { title: "AI Matching", path: "/ai-matching", icon: BrainCircuit },
  { title: "Interview Questions", path: "/questions", icon: MessageSquareText },
  { title: "Candidate Summary", path: "/summary", icon: FileText },
  { title: "Invitations", path: "/invitations", icon: Mail },
  { title: "Evaluations", path: "/evaluations", icon: History },
  { title: "Resume Ranking", path: "/ranking", icon: BarChart3 },
  { title: "Resume Search", path: "/search", icon: FileSearch },
  { title: "Settings", path: "/settings", icon: Settings },
];

function Sidebar() {
  const { logout, user } = useAuth();

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user?.role);
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">AI</div>
        <div>
          <h2>ResumeAI</h2>
          <p>Screening Assistant</p>
        </div>
      </div>

      <div className="sidebar-role-card">
        <div>
          <span>{user?.role || "User"}</span>
          <p>{user?.full_name || "Logged in user"}</p>
        </div>

        <Lock size={17} />
      </div>

      <nav className="sidebar-menu">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={19} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-button" onClick={logout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
