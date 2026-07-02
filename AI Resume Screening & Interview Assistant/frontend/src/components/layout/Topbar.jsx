import { Bell, CalendarDays, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">AI Resume Screening Platform</p>
        <h1>Recruitment Intelligence Dashboard</h1>
      </div>

      <div className="topbar-actions">
        <div className="date-chip">
          <CalendarDays size={17} />
          {today}
        </div>

        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search candidates, skills, jobs..." />
        </div>

        <button className="icon-button">
          <Bell size={18} />
        </button>

        <div className="user-chip">
          <div className="user-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h4>{user?.full_name || "User"}</h4>
            <p>
              <ShieldCheck size={13} />
              {user?.role || "Role"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
