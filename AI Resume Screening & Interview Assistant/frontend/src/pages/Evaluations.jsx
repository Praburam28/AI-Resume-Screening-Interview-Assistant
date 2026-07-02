import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Search,
  Target,
  UserRound,
} from "lucide-react";
import api from "../api/axios";

function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState("");
  const [minScore, setMinScore] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const candidateMap = useMemo(() => {
    const map = {};
    candidates.forEach((candidate) => {
      map[candidate.id] = candidate;
    });
    return map;
  }, [candidates]);

  const jobMap = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      map[job.id] = job;
    });
    return map;
  }, [jobs]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [evaluationRes, candidateRes, jobRes] = await Promise.allSettled([
        api.get("/ai/evaluations"),
        api.get("/candidates/"),
        api.get("/jobs/"),
      ]);

      if (evaluationRes.status === "fulfilled") {
        setEvaluations(evaluationRes.value.data);

        if (evaluationRes.value.data.length > 0) {
          loadEvaluationDetails(evaluationRes.value.data[0].id);
        }
      }

      if (candidateRes.status === "fulfilled") {
        setCandidates(candidateRes.value.data);
      }

      if (jobRes.status === "fulfilled") {
        setJobs(jobRes.value.data);
      }

      if (evaluationRes.status === "rejected") {
        setError(
          evaluationRes.reason?.response?.data?.detail ||
            evaluationRes.reason?.message ||
            "Failed to load evaluation history."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadEvaluationDetails = async (evaluationId) => {
    if (!evaluationId) return;

    setDetailLoading(true);

    try {
      const response = await api.get("/ai/evaluations/" + evaluationId);
      setSelectedEvaluation(response.data);
    } catch {
      const fallback = evaluations.find((item) => item.id === evaluationId);
      setSelectedEvaluation(fallback || null);
    } finally {
      setDetailLoading(false);
    }
  };

  const getCandidateName = (candidateId) => {
    return candidateMap[candidateId]?.name || "Candidate #" + candidateId;
  };

  const getCandidateEmail = (candidateId) => {
    return candidateMap[candidateId]?.email || "Email unavailable";
  };

  const getJobTitle = (jobId) => {
    return jobMap[jobId]?.job_title || "Job #" + jobId;
  };

  const getScoreTone = (score) => {
    const value = Number(score || 0);

    if (value >= 80) return "excellent";
    if (value >= 60) return "good";
    if (value >= 40) return "average";
    return "low";
  };

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => {
      const candidateName = getCandidateName(evaluation.candidate_id).toLowerCase();
      const candidateEmail = getCandidateEmail(evaluation.candidate_id).toLowerCase();
      const jobTitle = getJobTitle(evaluation.job_id).toLowerCase();
      const recommendation = String(evaluation.recommendation || "").toLowerCase();

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        candidateName.includes(query) ||
        candidateEmail.includes(query) ||
        jobTitle.includes(query) ||
        recommendation.includes(query);

      const matchesRecommendation =
        !recommendationFilter ||
        recommendation.includes(recommendationFilter.toLowerCase());

      const matchesScore =
        !minScore || Number(evaluation.match_score || 0) >= Number(minScore);

      return matchesSearch && matchesRecommendation && matchesScore;
    });
  }, [
    evaluations,
    search,
    recommendationFilter,
    minScore,
    candidateMap,
    jobMap,
  ]);

  const averageScore = useMemo(() => {
    if (evaluations.length === 0) return 0;

    const total = evaluations.reduce(
      (sum, item) => sum + Number(item.match_score || 0),
      0
    );

    return Math.round(total / evaluations.length);
  }, [evaluations]);

  const highestScore = useMemo(() => {
    if (evaluations.length === 0) return 0;

    return Math.max(...evaluations.map((item) => Number(item.match_score || 0)));
  }, [evaluations]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading evaluation history...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Screening Records</p>
          <h2>Evaluation History</h2>
          <p>
            Review previous AI resume matches, candidate suitability scores,
            recommendations, strengths, weaknesses, and missing skills.
          </p>
        </div>

        <div className="ai-badge">
          <BrainCircuit size={20} />
          Evaluation Archive
        </div>
      </div>

      {error && (
        <div className="error-alert inline-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="evaluation-stats-grid">
        <div className="evaluation-stat-card blue">
          <div>
            <span>Total Evaluations</span>
            <h3>{evaluations.length}</h3>
          </div>
          <FileText size={28} />
        </div>

        <div className="evaluation-stat-card green">
          <div>
            <span>Average Score</span>
            <h3>{averageScore}%</h3>
          </div>
          <BarChart3 size={28} />
        </div>

        <div className="evaluation-stat-card purple">
          <div>
            <span>Highest Score</span>
            <h3>{highestScore}%</h3>
          </div>
          <Target size={28} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Search Evaluations</h3>
            <p>Filter by candidate, job, recommendation, or minimum score.</p>
          </div>
        </div>

        <div className="evaluation-filter-grid">
          <div className="filter-input">
            <Search size={18} />
            <input
              placeholder="Search candidate, job, or recommendation"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="select-input compact-select"
            value={recommendationFilter}
            onChange={(event) => setRecommendationFilter(event.target.value)}
          >
            <option value="">All Recommendations</option>
            <option value="Strong">Strong</option>
            <option value="Good">Good</option>
            <option value="Moderate">Moderate</option>
            <option value="Weak">Weak</option>
            <option value="Not">Not Suitable</option>
          </select>

          <input
            className="plain-input"
            type="number"
            placeholder="Min score"
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
          />
        </div>
      </div>

      <div className="evaluation-layout-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Evaluation Records</h3>
              <p>{filteredEvaluations.length} records found</p>
            </div>
          </div>

          {filteredEvaluations.length > 0 ? (
            <div className="evaluation-list">
              {filteredEvaluations.map((evaluation) => {
                const tone = getScoreTone(evaluation.match_score);
                const isActive = selectedEvaluation?.id === evaluation.id;

                return (
                  <button
                    key={evaluation.id}
                    className={
                      isActive
                        ? "evaluation-list-item active"
                        : "evaluation-list-item"
                    }
                    onClick={() => loadEvaluationDetails(evaluation.id)}
                  >
                    <div className="evaluation-list-top">
                      <div className="candidate-avatar small-avatar">
                        {getCandidateName(evaluation.candidate_id)
                          ?.charAt(0)
                          ?.toUpperCase() || <UserRound size={18} />}
                      </div>

                      <div>
                        <h4>{getCandidateName(evaluation.candidate_id)}</h4>
                        <p>{getJobTitle(evaluation.job_id)}</p>
                      </div>

                      <span className={`mini-score ${tone}`}>
                        {evaluation.match_score || 0}%
                      </span>
                    </div>

                    <div className="evaluation-list-bottom">
                      <span>{evaluation.recommendation || "No recommendation"}</span>
                      <span>
                        {evaluation.created_at
                          ? new Date(evaluation.created_at).toLocaleDateString()
                          : "Date unavailable"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">No evaluations found.</div>
          )}
        </div>

        <div className="panel evaluation-detail-panel">
          <div className="panel-header split-header">
            <div>
              <h3>Evaluation Details</h3>
              <p>Complete AI screening result.</p>
            </div>

            <div className="header-icon">
              <Eye size={22} />
            </div>
          </div>

          {detailLoading ? (
            <div className="dashboard-loading compact-loader">
              <Loader2 className="spin" size={28} />
              <p>Loading details...</p>
            </div>
          ) : selectedEvaluation ? (
            <div className="evaluation-detail-content">
              <div
                className={`evaluation-score-banner ${getScoreTone(
                  selectedEvaluation.match_score
                )}`}
              >
                <div>
                  <span>Match Score</span>
                  <h2>{selectedEvaluation.match_score || 0}%</h2>
                </div>

                <CheckCircle2 size={38} />
              </div>

              <div className="context-card">
                <div className="context-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <span>Candidate</span>
                  <h4>{getCandidateName(selectedEvaluation.candidate_id)}</h4>
                  <p>{getCandidateEmail(selectedEvaluation.candidate_id)}</p>
                </div>
              </div>

              <div className="context-card">
                <div className="context-icon job">
                  <BriefcaseBusiness size={22} />
                </div>

                <div>
                  <span>Job Role</span>
                  <h4>{getJobTitle(selectedEvaluation.job_id)}</h4>
                  <p>
                    {jobMap[selectedEvaluation.job_id]?.location ||
                      "Location unavailable"}
                  </p>
                </div>
              </div>

              <div className="result-section">
                <h4>Recommendation</h4>
                <p>
                  {selectedEvaluation.recommendation ||
                    "No recommendation available."}
                </p>
              </div>

              <div className="result-section">
                <h4>AI Summary</h4>
                <p>{selectedEvaluation.ai_summary || "No summary available."}</p>
              </div>

              <div className="result-section">
                <h4>Strengths</h4>
                <p>{selectedEvaluation.strengths || "No strengths available."}</p>
              </div>

              <div className="result-section">
                <h4>Weaknesses</h4>
                <p>
                  {selectedEvaluation.weaknesses || "No weaknesses available."}
                </p>
              </div>

              <div className="result-section">
                <h4>Missing Skills</h4>
                <p>
                  {selectedEvaluation.missing_skills ||
                    "No missing skills available."}
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select an evaluation to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Evaluations;
