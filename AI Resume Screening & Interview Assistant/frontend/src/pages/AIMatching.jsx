import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  UserRound,
  WandSparkles,
} from "lucide-react";
import api from "../api/axios";

function AIMatching() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const selectedCandidate = useMemo(() => {
    return candidates.find((candidate) => String(candidate.id) === String(candidateId));
  }, [candidates, candidateId]);

  const selectedJob = useMemo(() => {
    return jobs.find((job) => String(job.id) === String(jobId));
  }, [jobs, jobId]);

  const loadData = async () => {
    setLoadingData(true);
    setError("");

    try {
      const [candidateRes, jobRes] = await Promise.all([
        api.get("/candidates/"),
        api.get("/jobs/"),
      ]);

      setCandidates(candidateRes.data);
      setJobs(jobRes.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load candidates and jobs."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const runMatch = async () => {
    if (!candidateId || !jobId) {
      setError("Please select both a candidate and a job description.");
      return;
    }

    setMatching(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/ai/match", {
        candidate_id: Number(candidateId),
        job_id: Number(jobId),
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "AI matching failed. Please try again."
      );
    } finally {
      setMatching(false);
    }
  };

  const getScoreTone = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";
    return "low";
  };

  const score = Number(result?.match_score || 0);
  const scoreTone = getScoreTone(score);

  if (loadingData) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading candidates and job descriptions...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Resume Screening</p>
          <h2>AI Resume Matching</h2>
          <p>
            Select a candidate resume and job description to calculate match
            score, missing skills, strengths, weaknesses, and hiring recommendation.
          </p>
        </div>

        <div className="ai-badge">
          <BrainCircuit size={20} />
          Gemini / Local Matching Engine
        </div>
      </div>

      {error && (
        <div className="error-alert inline-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="matching-hero">
        <div>
          <span>
            <Sparkles size={16} />
            Intelligent Candidate Evaluation
          </span>
          <h3>Compare resumes with job requirements in seconds.</h3>
          <p>
            The system analyzes extracted resume skills, experience, education,
            and job requirements to produce recruiter-friendly screening insights.
          </p>
        </div>

        <div className="matching-hero-icon">
          <WandSparkles size={46} />
        </div>
      </div>

      <div className="match-selection-grid">
        <div className="panel selector-panel">
          <div className="panel-header split-header">
            <div>
              <h3>Select Candidate</h3>
              <p>Choose an uploaded resume profile.</p>
            </div>

            <div className="header-icon">
              <UserRound size={22} />
            </div>
          </div>

          <select
            className="select-input large-select"
            value={candidateId}
            onChange={(event) => {
              setCandidateId(event.target.value);
              setResult(null);
            }}
          >
            <option value="">Choose candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name || "Unnamed Candidate"} � {candidate.email || "No email"}
              </option>
            ))}
          </select>

          {selectedCandidate ? (
            <div className="selection-preview">
              <div className="candidate-avatar">
                {selectedCandidate.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div>
                <h4>{selectedCandidate.name || "Name not extracted"}</h4>
                <p>{selectedCandidate.email || "Email not found"}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty">
              No candidate selected.
            </div>
          )}

          {selectedCandidate && (
            <>
              <div className="candidate-meta">
                <div>
                  <span>Phone</span>
                  <strong>{selectedCandidate.phone || "Not found"}</strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>{selectedCandidate.total_experience || "Not found"}</strong>
                </div>
              </div>

              <div className="skill-wrap compact">
                {selectedCandidate.skills?.length > 0 ? (
                  selectedCandidate.skills.slice(0, 10).map((skill) => (
                    <span className="skill-pill" key={skill.id}>
                      {skill.skill_name}
                    </span>
                  ))
                ) : (
                  <span className="muted-text">No skills extracted</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="panel selector-panel">
          <div className="panel-header split-header">
            <div>
              <h3>Select Job</h3>
              <p>Choose a job description for comparison.</p>
            </div>

            <div className="header-icon">
              <BriefcaseBusiness size={22} />
            </div>
          </div>

          <select
            className="select-input large-select"
            value={jobId}
            onChange={(event) => {
              setJobId(event.target.value);
              setResult(null);
            }}
          >
            <option value="">Choose job description</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_title} � {job.location || "No location"}
              </option>
            ))}
          </select>

          {selectedJob ? (
            <div className="selection-preview">
              <div className="job-card-icon small-job-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h4>{selectedJob.job_title}</h4>
                <p>{selectedJob.employment_type || "Employment type not set"}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty">
              No job selected.
            </div>
          )}

          {selectedJob && (
            <>
              <div className="candidate-meta">
                <div>
                  <span>Location</span>
                  <strong>{selectedJob.location || "Not set"}</strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>{selectedJob.experience_requirement || "Not set"}</strong>
                </div>
              </div>

              <div className="skill-wrap compact">
                {selectedJob.required_skills?.length > 0 ? (
                  selectedJob.required_skills.slice(0, 10).map((skill) => (
                    <span className="skill-pill" key={skill.id}>
                      {skill.skill_name}
                    </span>
                  ))
                ) : (
                  <span className="muted-text">No required skills added</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="match-action-panel">
        <div>
          <h3>Ready to generate match analysis?</h3>
          <p>
            This will create a new evaluation history record for the selected
            candidate and job description.
          </p>
        </div>

        <button
          className="primary-button inline-primary match-button"
          onClick={runMatch}
          disabled={matching || !candidateId || !jobId}
        >
          {matching ? (
            <>
              <Loader2 className="spin" size={18} />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Target size={18} />
              Run AI Match
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="match-result-grid">
          <div
              className={`panel score-panel ${scoreTone}`}
                style={{ "--score": score }}>
            <div className="score-circle">
              <div>
                <h2>{score}%</h2>
                <p>Match Score</p>
              </div>
            </div>

            <div className="score-summary">
              <h3>{result.recommendation || "Recommendation unavailable"}</h3>
              <p>{result.ai_summary || "No AI summary available."}</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header split-header">
              <div>
                <h3>Screening Result</h3>
                <p>Candidate suitability breakdown.</p>
              </div>

              <div className="success-mark">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="result-section">
              <h4>Strengths</h4>
              <p>{result.strengths || "No strengths generated."}</p>
            </div>

            <div className="result-section">
              <h4>Weaknesses</h4>
              <p>{result.weaknesses || "No weaknesses generated."}</p>
            </div>

            <div className="result-section">
              <h4>Missing Skills</h4>
              <p>{result.missing_skills || "No missing skills identified."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIMatching;
