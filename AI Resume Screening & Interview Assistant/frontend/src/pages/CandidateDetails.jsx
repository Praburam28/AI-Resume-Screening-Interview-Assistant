import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function CandidateDetails() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/candidates/${id}`);
      setCandidate(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load candidate details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading candidate profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  if (!candidate) {
    return <div className="empty-state">Candidate not found.</div>;
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <Link to="/candidates" className="back-link">
            <ArrowLeft size={16} />
            Back to Candidates
          </Link>

          <p className="eyebrow">Candidate Profile</p>
          <h2>{candidate.name || "Name not extracted"}</h2>
          <p>Review extracted resume details and candidate profile.</p>
        </div>

        <Link to="/ai-matching" className="action-button">
          Run AI Match
        </Link>
      </div>

      <div className="profile-grid">
        <div className="panel profile-main-card">
          <div className="candidate-avatar-xl">
            {candidate.name?.charAt(0)?.toUpperCase() || <UserRound size={42} />}
          </div>

          <h2>{candidate.name || "Name not extracted"}</h2>
          <p>{candidate.resume_file_name}</p>

          <div className="contact-list">
            <div>
              <Mail size={18} />
              <span>{candidate.email || "Email not found"}</span>
            </div>

            <div>
              <Phone size={18} />
              <span>{candidate.phone || "Phone not found"}</span>
            </div>

            <div>
              <BriefcaseBusiness size={18} />
              <span>{candidate.total_experience || "Experience not found"}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Extracted Skills</h3>
              <p>Skills identified from the uploaded resume.</p>
            </div>
          </div>

          <div className="skill-wrap">
            {candidate.skills?.length > 0 ? (
              candidate.skills.map((skill) => (
                <span className="skill-pill" key={skill.id}>
                  {skill.skill_name}
                </span>
              ))
            ) : (
              <div className="empty-state">No skills extracted.</div>
            )}
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Education</h3>
              <p>Education details extracted from resume.</p>
            </div>
          </div>

          <div className="text-box">
            {candidate.education || "Education details not found."}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Resume File</h3>
              <p>Stored resume information.</p>
            </div>
          </div>

          <div className="file-info-card">
            <FileText size={32} />
            <div>
              <h4>{candidate.resume_file_name}</h4>
              <p>{candidate.resume_file_path}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;
