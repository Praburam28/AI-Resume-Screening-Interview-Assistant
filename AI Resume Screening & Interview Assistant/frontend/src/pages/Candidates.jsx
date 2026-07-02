import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (skill) params.append("skill", skill);
      if (experience) params.append("experience", experience);

      const response = await api.get(`/candidates/?${params.toString()}`);
      setCandidates(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadCandidates();
  };

  const handleDelete = async (candidateId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/candidates/${candidateId}`);
      setCandidates((prev) =>
        prev.filter((candidate) => candidate.id !== candidateId)
      );
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Delete failed. Only HR users can delete candidates."
      );
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Candidate Database</p>
          <h2>Candidate Management</h2>
          <p>
            Search, review, and manage uploaded resumes with extracted skills and
            candidate information.
          </p>
        </div>

        <Link to="/upload-resume" className="action-button">
          Upload Resume
        </Link>
      </div>

      <div className="panel">
        <form className="filter-grid" onSubmit={handleSearch}>
          <div className="filter-input">
            <Search size={18} />
            <input
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <input
            className="plain-input"
            placeholder="Filter by skill"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
          />

          <input
            className="plain-input"
            placeholder="Filter by experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
          />

          <button className="small-primary-button" type="submit">
            Search
          </button>
        </form>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="panel">
        <div className="panel-header split-header">
          <div>
            <h3>All Candidates</h3>
            <p>{candidates.length} candidates found</p>
          </div>

          <div className="header-icon">
            <Users size={22} />
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <Loader2 className="spin" size={30} />
            <p>Loading candidates...</p>
          </div>
        ) : candidates.length > 0 ? (
          <div className="candidate-card-grid">
            {candidates.map((candidate) => (
              <div className="candidate-card" key={candidate.id}>
                <div className="candidate-card-top">
                  <div className="candidate-avatar">
                    {candidate.name?.charAt(0)?.toUpperCase() || (
                      <UserRound size={22} />
                    )}
                  </div>

                  <div className="candidate-main">
                    <h3>{candidate.name || "Name not extracted"}</h3>
                    <p>{candidate.email || "Email not found"}</p>
                  </div>
                </div>

                <div className="candidate-meta">
                  <div>
                    <span>Phone</span>
                    <strong>{candidate.phone || "Not found"}</strong>
                  </div>

                  <div>
                    <span>Experience</span>
                    <strong>{candidate.total_experience || "Not found"}</strong>
                  </div>
                </div>

                <div className="skill-wrap compact">
                  {candidate.skills?.length > 0 ? (
                    candidate.skills.slice(0, 6).map((skill) => (
                      <span className="skill-pill" key={skill.id}>
                        {skill.skill_name}
                      </span>
                    ))
                  ) : (
                    <span className="muted-text">No skills extracted</span>
                  )}
                </div>

                <div className="candidate-actions">
                  <Link
                    to={`/candidates/${candidate.id}`}
                    className="ghost-button"
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  <button
                    className="danger-button"
                    onClick={() => handleDelete(candidate.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No candidates found. Upload a resume to begin.
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidates;
