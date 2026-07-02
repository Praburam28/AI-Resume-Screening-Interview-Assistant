import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Crown,
  Loader2,
  Medal,
  RefreshCcw,
  Search,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import api from "../api/axios";

function ResumeRanking() {
  const [jobs, setJobs] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [jobId, setJobId] = useState("");
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedJob = useMemo(() => {
    return jobs.find((job) => String(job.id) === String(jobId));
  }, [jobs, jobId]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();

      if (jobId) query.append("job_id", jobId);
      if (limit) query.append("limit", String(limit));

      const [jobsRes, rankingRes] = await Promise.allSettled([
        api.get("/jobs/"),
        api.get("/analytics/resume-ranking?" + query.toString()),
      ]);

      if (jobsRes.status === "fulfilled") {
        setJobs(jobsRes.value.data);
      }

      if (rankingRes.status === "fulfilled") {
        setRanking(rankingRes.value.data);
      }

      if (rankingRes.status === "rejected") {
        setError(
          rankingRes.reason?.response?.data?.detail ||
            rankingRes.reason?.message ||
            "Failed to load resume ranking leaderboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = (event) => {
    event.preventDefault();
    loadData();
  };

  const filteredRanking = useMemo(() => {
    const query = search.toLowerCase();

    if (!query) return ranking;

    return ranking.filter((item) => {
      return (
        String(item.candidate_name || "").toLowerCase().includes(query) ||
        String(item.candidate_email || "").toLowerCase().includes(query) ||
        String(item.job_title || "").toLowerCase().includes(query) ||
        String(item.recommendation || "").toLowerCase().includes(query)
      );
    });
  }, [ranking, search]);

  const getScoreTone = (score) => {
    const value = Number(score || 0);

    if (value >= 80) return "excellent";
    if (value >= 60) return "good";
    if (value >= 40) return "average";
    return "low";
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Crown size={22} />;
    if (index === 1) return <Trophy size={22} />;
    if (index === 2) return <Medal size={22} />;
    return <Award size={20} />;
  };

  const topCandidate = filteredRanking[0];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading resume ranking leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Candidate Ranking</p>
          <h2>Resume Ranking Leaderboard</h2>
          <p>
            Rank candidates by AI match score across all jobs or for a selected
            job description.
          </p>
        </div>

        <div className="ai-badge">
          <Target size={20} />
          Ranking Engine
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="ranking-hero">
        <div>
          <span>
            <Trophy size={16} />
            Top Candidate Intelligence
          </span>
          <h3>Quickly identify the strongest candidates for each job role.</h3>
          <p>
            Use AI match score, recommendation, strengths, weaknesses, and
            missing skills to shortlist candidates faster.
          </p>
        </div>

        <div className="ranking-hero-icon">
          <Crown size={48} />
        </div>
      </div>

      <div className="ranking-filter-panel panel">
        <form className="ranking-filter-grid" onSubmit={handleApply}>
          <select
            className="select-input compact-select"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_title} — {job.location || "No location"}
              </option>
            ))}
          </select>

          <select
            className="select-input compact-select"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>

          <div className="filter-input">
            <Search size={18} />
            <input
              placeholder="Search candidate or recommendation"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button className="small-primary-button" type="submit">
            <RefreshCcw size={16} />
            Apply
          </button>
        </form>
      </div>

      {selectedJob && (
        <div className="panel selected-ranking-job">
          <div className="context-card">
            <div className="context-icon job">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <span>Selected Job</span>
              <h4>{selectedJob.job_title}</h4>
              <p>
                {selectedJob.location || "Location not set"} •{" "}
                {selectedJob.experience_requirement || "Experience not set"}
              </p>
            </div>
          </div>
        </div>
      )}

      {topCandidate && (
        <div className="top-candidate-card">
          <div className="top-candidate-badge">
            <Crown size={30} />
          </div>

          <div>
            <span>Highest Ranked Candidate</span>
            <h3>{topCandidate.candidate_name || "Unnamed Candidate"}</h3>
            <p>
              {topCandidate.job_title} • {topCandidate.recommendation || "No recommendation"}
            </p>
          </div>

          <div className={`top-score ${getScoreTone(topCandidate.match_score)}`}>
            {topCandidate.match_score || 0}%
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Leaderboard</h3>
            <p>{filteredRanking.length} ranked candidates found</p>
          </div>
        </div>

        {filteredRanking.length > 0 ? (
          <div className="ranking-table-list">
            {filteredRanking.map((item, index) => {
              const tone = getScoreTone(item.match_score);

              return (
                <div className="ranking-table-item" key={item.evaluation_id}>
                  <div className={`rank-medal rank-${index + 1}`}>
                    {getRankIcon(index)}
                    <strong>#{index + 1}</strong>
                  </div>

                  <div className="ranking-candidate-info">
                    <div className="candidate-avatar small-avatar">
                      {item.candidate_name?.charAt(0)?.toUpperCase() || (
                        <UserRound size={18} />
                      )}
                    </div>

                    <div>
                      <h4>{item.candidate_name || "Unnamed Candidate"}</h4>
                      <p>{item.candidate_email || "Email unavailable"}</p>
                    </div>
                  </div>

                  <div className="ranking-job-info">
                    <span>Job Role</span>
                    <strong>{item.job_title}</strong>
                  </div>

                  <div className="ranking-recommendation">
                    <span>Recommendation</span>
                    <strong>{item.recommendation || "Unavailable"}</strong>
                  </div>

                  <div className={`ranking-score ${tone}`}>
                    {item.match_score || 0}%
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            No ranking records found. Run AI matching first.
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeRanking;
