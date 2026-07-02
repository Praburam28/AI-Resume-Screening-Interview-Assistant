import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, logout } = useAuth();

  const [preferences, setPreferences] = useState({
    compactMode: false,
    emailNotifications: true,
    aiTips: true,
    dashboardAnimations: true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("resume_ai_preferences");

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem("resume_ai_preferences", JSON.stringify(preferences));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const permissions = [
    {
      feature: "View candidates",
      hr: true,
      recruiter: true,
    },
    {
      feature: "Upload resumes",
      hr: true,
      recruiter: false,
    },
    {
      feature: "Create and edit jobs",
      hr: true,
      recruiter: false,
    },
    {
      feature: "Run AI matching",
      hr: true,
      recruiter: true,
    },
    {
      feature: "Generate interview questions",
      hr: true,
      recruiter: true,
    },
    {
      feature: "Generate candidate summaries",
      hr: true,
      recruiter: true,
    },
    {
      feature: "View evaluation history",
      hr: true,
      recruiter: true,
    },
    {
      feature: "View admin analytics",
      hr: true,
      recruiter: false,
    },
  ];

  const role = user?.role || "User";

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account Center</p>
          <h2>Settings & Profile</h2>
          <p>
            Manage your profile view, workspace preferences, role permissions,
            and application security information.
          </p>
        </div>

        <div className="ai-badge">
          <ShieldCheck size={20} />
          {role} Access
        </div>
      </div>

      <div className="settings-hero">
        <div>
          <span>
            <Sparkles size={16} />
            Personalized Hiring Workspace
          </span>
          <h3>Control your recruitment dashboard experience.</h3>
          <p>
            View your logged-in profile, understand your role access, and adjust
            local interface preferences for a cleaner workflow.
          </p>
        </div>

        <div className="settings-hero-icon">
          <SlidersHorizontal size={48} />
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel profile-card">
          <div className="profile-cover"></div>

          <div className="profile-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || <UserRound size={42} />}
          </div>

          <h2>{user?.full_name || "User"}</h2>
          <p>{user?.email || "Email unavailable"}</p>

          <div className="profile-role-badge">
            <ShieldCheck size={16} />
            {role}
          </div>

          <div className="profile-info-list">
            <div>
              <Mail size={18} />
              <span>Email</span>
              <strong>{user?.email || "Unavailable"}</strong>
            </div>

            <div>
              <UserRound size={18} />
              <span>Name</span>
              <strong>{user?.full_name || "Unavailable"}</strong>
            </div>

            <div>
              <Lock size={18} />
              <span>Account Status</span>
              <strong>{user?.is_active === false ? "Inactive" : "Active"}</strong>
            </div>
          </div>

          <button className="danger-outline-button" onClick={logout}>
            Logout Account
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Workspace Preferences</h3>
              <p>These settings are saved locally in your browser.</p>
            </div>
          </div>

          <div className="preference-list">
            <button
              className="preference-item"
              onClick={() => handleToggle("compactMode")}
            >
              <div>
                <h4>Compact dashboard mode</h4>
                <p>Reduce spacing and make dashboard sections tighter.</p>
              </div>

              <span className={preferences.compactMode ? "toggle on" : "toggle"}>
                <i></i>
              </span>
            </button>

            <button
              className="preference-item"
              onClick={() => handleToggle("emailNotifications")}
            >
              <div>
                <h4>Email notifications</h4>
                <p>Keep notification preference enabled for hiring activity.</p>
              </div>

              <span
                className={preferences.emailNotifications ? "toggle on" : "toggle"}
              >
                <i></i>
              </span>
            </button>

            <button
              className="preference-item"
              onClick={() => handleToggle("aiTips")}
            >
              <div>
                <h4>AI guidance tips</h4>
                <p>Show smart hints for matching, ranking, and summaries.</p>
              </div>

              <span className={preferences.aiTips ? "toggle on" : "toggle"}>
                <i></i>
              </span>
            </button>

            <button
              className="preference-item"
              onClick={() => handleToggle("dashboardAnimations")}
            >
              <div>
                <h4>Dashboard animations</h4>
                <p>Use smooth transitions across cards and panels.</p>
              </div>

              <span
                className={preferences.dashboardAnimations ? "toggle on" : "toggle"}
              >
                <i></i>
              </span>
            </button>
          </div>

          <button className="primary-button settings-save-button" onClick={savePreferences}>
            <Save size={18} />
            Save Preferences
          </button>

          {saved && (
            <div className="success-alert inline-alert">
              <CheckCircle2 size={18} />
              Preferences saved successfully.
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header split-header">
          <div>
            <h3>Role-Based Permission Matrix</h3>
            <p>Understand what HR and Recruiter users can access.</p>
          </div>

          <div className="header-icon">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="permission-table-wrapper">
          <table className="modern-table permission-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>HR</th>
                <th>Recruiter</th>
              </tr>
            </thead>

            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.feature}>
                  <td>{permission.feature}</td>
                  <td>
                    {permission.hr ? (
                      <span className="permission yes">Allowed</span>
                    ) : (
                      <span className="permission no">Restricted</span>
                    )}
                  </td>
                  <td>
                    {permission.recruiter ? (
                      <span className="permission yes">Allowed</span>
                    ) : (
                      <span className="permission no">Restricted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="settings-bottom-grid">
        <div className="panel security-panel">
          <div className="security-icon">
            <Lock size={32} />
          </div>

          <h3>Security</h3>
          <p>
            Authentication is protected using JWT tokens. Your frontend stores
            the access token locally and sends it with secured API requests.
          </p>
        </div>

        <div className="panel security-panel">
          <div className="security-icon notification">
            <Bell size={32} />
          </div>

          <h3>Notifications</h3>
          <p>
            Notification preferences are prepared for future backend integration.
            Current settings are saved locally in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
