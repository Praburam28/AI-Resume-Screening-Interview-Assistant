import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  ClipboardList,
  Loader2,
  MessageSquareText,
  Sparkles,
  UserRound,
} from "lucide-react";
import api from "../api/axios";

function InterviewQuestions() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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
        api.get("/ai/questions/history"),
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
          "Failed to load interview question data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateQuestions = async () => {
    if (!candidateId || !jobId) {
      setError("Please select both a candidate and a job description.");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/ai/questions", {
        candidate_id: Number(candidateId),
        job_id: Number(jobId),
      });

      setResult(response.data);
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Interview question generation failed."
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading interview question workspace...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Interview Assistant</p>
          <h2>Interview Question Generator</h2>
          <p>
            Generate technical, scenario-based, and behavioral questions using
            candidate skills, resume experience, and the selected job description.
          </p>
        </div>

        <div className="ai-badge">
          <BrainCircuit size={20} />
          Gemini Interview Engine
        </div>
      </div>

      {error && (
        <div className="error-alert inline-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="question-hero">
        <div>
          <span>
            <Sparkles size={16} />
            Smart Interview Preparation
          </span>
          <h3>Generate structured questions for better candidate evaluation.</h3>
          <p>
            The assistant prepares role-specific questions so recruiters can test
            technical ability, real-world thinking, and behavioral fit.
          </p>
        </div>

        <div className="question-hero-icon">
          <MessageSquareText size={46} />
        </div>
      </div>

      <div className="question-workspace-grid">
        <div className="panel">
          <div className="panel-header split-header">
            <div>
              <h3>Generate Questions</h3>
              <p>Select candidate and job to create interview questions.</p>
            </div>

            <div className="header-icon">
              <ClipboardList size={22} />
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
                  setResult(null);
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
                  setResult(null);
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
              onClick={generateQuestions}
              disabled={generating || !candidateId || !jobId}
            >
              {generating ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Generating Questions...
                </>
              ) : (
                "Generate Interview Questions"
              )}
            </button>
          </div>
        </div>

        <div className="panel selected-context-card">
          <div className="panel-header">
            <div>
              <h3>Selected Context</h3>
              <p>Preview candidate and job details before generating.</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon">
              <UserRound size={22} />
            </div>

            <div>
              <span>Candidate</span>
              <h4>{selectedCandidate?.name || "No candidate selected"}</h4>
              <p>{selectedCandidate?.email || "Select a candidate first"}</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon job">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <span>Job Role</span>
              <h4>{selectedJob?.job_title || "No job selected"}</h4>
              <p>{selectedJob?.experience_requirement || "Select a job first"}</p>
            </div>
          </div>

          {selectedCandidate?.skills?.length > 0 && (
            <div className="skill-wrap compact">
              {selectedCandidate.skills.slice(0, 8).map((skill) => (
                <span className="skill-pill" key={skill.id}>
                  {skill.skill_name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="question-result-grid">
          <div className="panel question-result-card technical">
            <h3>Technical Questions</h3>
            <div className="question-text">
              {result.technical_questions || "No technical questions generated."}
            </div>
          </div>

          <div className="panel question-result-card scenario">
            <h3>Scenario-Based Questions</h3>
            <div className="question-text">
              {result.scenario_questions || "No scenario questions generated."}
            </div>
          </div>

          <div className="panel question-result-card behavioral">
            <h3>Behavioral Questions</h3>
            <div className="question-text">
              {result.behavioral_questions || "No behavioral questions generated."}
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Question Generation History</h3>
            <p>Previously generated interview question sets.</p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <div className="history-icon">
                  <MessageSquareText size={20} />
                </div>

                <div>
                  <h4>Question Set #{item.id}</h4>
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
          <div className="empty-state">No question history found.</div>
        )}
      </div>
    </div>
  );
}

export default InterviewQuestions;
