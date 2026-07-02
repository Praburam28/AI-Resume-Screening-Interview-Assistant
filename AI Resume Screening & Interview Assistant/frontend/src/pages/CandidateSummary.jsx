import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  Loader2,
  Sparkles,
  UserRound,
} from "lucide-react";
import api from "../api/axios";

function CandidateSummary() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  const selectedCandidate = useMemo(() => {
    return candidates.find((candidate) => String(candidate.id) === String(candidateId));
  }, [candidates, candidateId]);

  const selectedJob = useMemo(() => {
    return jobs.find((job) => String(job.id) === String(jobId));
  }, [jobs, jobId]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [candidateRes, jobRes, historyRes] = await Promise.allSettled([
        api.get("/candidates/"),
        api.get("/jobs/"),
        api.get("/ai/summaries/history"),
      ]);

      if (candidateRes.status === "fulfilled") {
        setCandidates(candidateRes.value.data);
      }

      if (jobRes.status === "fulfilled") {
        setJobs(jobRes.value.data);
      }

      if (historyRes.status === "fulfilled") {
        setHistory(historyRes.value.data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load candidate summary data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateSummary = async () => {
    if (!candidateId || !jobId) {
      setError("Please select both a candidate and a job description.");
      return;
    }

    setGenerating(true);
    setError("");
    setSummary(null);

    try {
      const response = await api.post("/ai/summary", {
        candidate_id: Number(candidateId),
        job_id: Number(jobId),
      });

      setSummary(response.data);
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Candidate summary generation failed."
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading candidate summary workspace...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Candidate Summary</p>
          <h2>Candidate Hiring Summary</h2>
          <p>
            Generate a professional candidate overview, skill assessment,
            experience summary, and hiring recommendation for a selected job.
          </p>
        </div>

        <div className="ai-badge">
          <BrainCircuit size={20} />
          Gemini Summary Engine
        </div>
      </div>

      {error && (
        <div className="error-alert inline-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="summary-hero">
        <div>
          <span>
            <Sparkles size={16} />
            Recruiter-Ready Insight
          </span>
          <h3>Create structured hiring recommendations from resume data.</h3>
          <p>
            The system summarizes the candidate profile, compares skills with
            the job description, and provides a clear recommendation.
          </p>
        </div>

        <div className="summary-hero-icon">
          <FileText size={46} />
        </div>
      </div>

      <div className="question-workspace-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Generate Candidate Summary</h3>
              <p>Select candidate and job to create a hiring summary.</p>
            </div>
          </div>

          <div className="ai-form-stack">
            <div>
              <label className="form-label">Candidate</label>
              <select
                className="select-input large-select"
                value={candidateId}
                onChange={(event) => {
                  setCandidateId(event.target.value);
                  setSummary(null);
                }}
              >
                <option value="">Choose candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name || "Unnamed Candidate"} — {candidate.email || "No email"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Job Description</label>
              <select
                className="select-input large-select"
                value={jobId}
                onChange={(event) => {
                  setJobId(event.target.value);
                  setSummary(null);
                }}
              >
                <option value="">Choose job description</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.job_title} — {job.location || "No location"}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="primary-button"
              onClick={generateSummary}
              disabled={generating || !candidateId || !jobId}
            >
              {generating ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Generating Summary...
                </>
              ) : (
                "Generate Candidate Summary"
              )}
            </button>
          </div>
        </div>

        <div className="panel selected-context-card">
          <div className="panel-header">
            <div>
              <h3>Selected Profile</h3>
              <p>Candidate and job context used for the summary.</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon">
              <UserRound size={22} />
            </div>

            <div>
              <span>Candidate</span>
              <h4>{selectedCandidate?.name || "No candidate selected"}</h4>
              <p>{selectedCandidate?.total_experience || "Experience not found"}</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon job">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <span>Job Role</span>
              <h4>{selectedJob?.job_title || "No job selected"}</h4>
              <p>{selectedJob?.employment_type || "Select a job first"}</p>
            </div>
          </div>
        </div>
      </div>

      {summary && (
        <div className="summary-result-grid">
          <div className="panel summary-card overview">
            <h3>Candidate Overview</h3>
            <p>{summary.candidate_overview || "No overview generated."}</p>
          </div>

          <div className="panel summary-card skill">
            <h3>Skill Assessment</h3>
            <p>{summary.skill_assessment || "No skill assessment generated."}</p>
          </div>

          <div className="panel summary-card experience">
            <h3>Experience Summary</h3>
            <p>{summary.experience_summary || "No experience summary generated."}</p>
          </div>

          <div className="panel summary-card recommendation">
            <h3>Hiring Recommendation</h3>
            <p>
              {summary.hiring_recommendation ||
                "No hiring recommendation generated."}
            </p>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Summary History</h3>
            <p>Previously generated candidate summaries.</p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <div className="history-icon summary">
                  <FileText size={20} />
                </div>

                <div>
                  <h4>Candidate Summary #{item.id}</h4>
                  <p>
                    Candidate ID: {item.candidate_id} • Job ID: {item.job_id}
                  </p>
                </div>

                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "Date unavailable"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No summary history found.</div>
        )}
      </div>
    </div>
  );
}

export default CandidateSummary;
