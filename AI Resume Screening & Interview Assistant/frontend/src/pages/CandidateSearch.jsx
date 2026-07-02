import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  Filter,
  Loader2,
  Mail,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);

  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState("");
  const [skillMode, setSkillMode] = useState("any");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/candidates/");
      setCandidates(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load candidate search data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const normalize = (value) => {
    return String(value || "").toLowerCase().trim();
  };

  const getCandidateSkillNames = (candidate) => {
    return candidate.skills?.map((skill) => skill.skill_name) || [];
  };

  const getSearchText = (candidate) => {
    const skillText = getCandidateSkillNames(candidate).join(" ");

    return normalize(`
      ${candidate.name || ""}
      ${candidate.email || ""}
      ${candidate.phone || ""}
      ${candidate.total_experience || ""}
      ${candidate.education || ""}
      ${candidate.resume_file_name || ""}
      ${skillText}
    `);
  };

  const parseSkillInput = () => {
    return skills
      .split(",")
      .map((item) => normalize(item))
      .filter(Boolean);
  };

  const calculateScore = (candidate) => {
    let score = 0;

    const searchText = getSearchText(candidate);
    const queryWords = normalize(query)
      .split(" ")
      .map((item) => item.trim())
      .filter(Boolean);

    const candidateSkills = getCandidateSkillNames(candidate).map((skill) =>
      normalize(skill)
    );

    const requiredSkills = parseSkillInput();

    queryWords.forEach((word) => {
      if (searchText.includes(word)) score += 8;
      if (normalize(candidate.name).includes(word)) score += 10;
      if (normalize(candidate.email).includes(word)) score += 8;
      if (candidateSkills.some((skill) => skill.includes(word))) score += 12;
      if (normalize(candidate.education).includes(word)) score += 6;
      if (normalize(candidate.total_experience).includes(word)) score += 6;
    });

    requiredSkills.forEach((requiredSkill) => {
      const matched = candidateSkills.some((candidateSkill) =>
        candidateSkill.includes(requiredSkill)
      );

      if (matched) score += 18;
    });

    if (experience && normalize(candidate.total_experience).includes(normalize(experience))) {
      score += 10;
    }

    if (education && normalize(candidate.education).includes(normalize(education))) {
      score += 10;
    }

    if (
      emailOrPhone &&
      (
        normalize(candidate.email).includes(normalize(emailOrPhone)) ||
        normalize(candidate.phone).includes(normalize(emailOrPhone))
      )
    ) {
      score += 10;
    }

    return score;
  };

  const searchedCandidates = useMemo(() => {
    const requiredSkills = parseSkillInput();

    let results = candidates
      .map((candidate) => {
        const candidateSkills = getCandidateSkillNames(candidate).map((skill) =>
          normalize(skill)
        );

        const searchText = getSearchText(candidate);

        const queryWords = normalize(query)
          .split(" ")
          .map((item) => item.trim())
          .filter(Boolean);

        const matchesQuery =
          queryWords.length === 0 ||
          queryWords.some((word) => searchText.includes(word));

        const skillMatches = requiredSkills.filter((requiredSkill) =>
          candidateSkills.some((candidateSkill) =>
            candidateSkill.includes(requiredSkill)
          )
        );

        const matchesSkills =
          requiredSkills.length === 0 ||
          (skillMode === "any" && skillMatches.length > 0) ||
          (skillMode === "all" && skillMatches.length === requiredSkills.length);

        const matchesExperience =
          !experience ||
          normalize(candidate.total_experience).includes(normalize(experience));

        const matchesEducation =
          !education ||
          normalize(candidate.education).includes(normalize(education));

        const matchesContact =
          !emailOrPhone ||
          normalize(candidate.email).includes(normalize(emailOrPhone)) ||
          normalize(candidate.phone).includes(normalize(emailOrPhone));

        const relevanceScore = calculateScore(candidate);

        return {
          ...candidate,
          relevanceScore,
          matchedSkills: skillMatches,
          totalSkillCount: candidateSkills.length,
        };
      })
      .filter((candidate) => {
        const requiredSkills = parseSkillInput();
        const candidateSkills = getCandidateSkillNames(candidate).map((skill) =>
          normalize(skill)
        );

        const searchText = getSearchText(candidate);

        const queryWords = normalize(query)
          .split(" ")
          .map((item) => item.trim())
          .filter(Boolean);

        const matchesQuery =
          queryWords.length === 0 ||
          queryWords.some((word) => searchText.includes(word));

        const skillMatches = requiredSkills.filter((requiredSkill) =>
          candidateSkills.some((candidateSkill) =>
            candidateSkill.includes(requiredSkill)
          )
        );

        const matchesSkills =
          requiredSkills.length === 0 ||
          (skillMode === "any" && skillMatches.length > 0) ||
          (skillMode === "all" && skillMatches.length === requiredSkills.length);

        const matchesExperience =
          !experience ||
          normalize(candidate.total_experience).includes(normalize(experience));

        const matchesEducation =
          !education ||
          normalize(candidate.education).includes(normalize(education));

        const matchesContact =
          !emailOrPhone ||
          normalize(candidate.email).includes(normalize(emailOrPhone)) ||
          normalize(candidate.phone).includes(normalize(emailOrPhone));

        return (
          matchesQuery &&
          matchesSkills &&
          matchesExperience &&
          matchesEducation &&
          matchesContact
        );
      });

    if (sortBy === "relevance") {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    if (sortBy === "name") {
      results.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    if (sortBy === "skills") {
      results.sort((a, b) => b.totalSkillCount - a.totalSkillCount);
    }

    if (sortBy === "recent") {
      results.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    return results;
  }, [
    candidates,
    query,
    skills,
    skillMode,
    experience,
    education,
    emailOrPhone,
    sortBy,
  ]);

  const topCandidate = searchedCandidates[0];

  const clearFilters = () => {
    setQuery("");
    setSkills("");
    setSkillMode("any");
    setExperience("");
    setEducation("");
    setEmailOrPhone("");
    setSortBy("relevance");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading semantic candidate search...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Semantic Resume Search</p>
          <h2>Candidate Search & Advanced Filters</h2>
          <p>
            Search candidates by skills, resume content, education, experience,
            email, phone, and extracted profile details.
          </p>
        </div>

        <div className="ai-badge">
          <BrainCircuit size={20} />
          Smart Search Engine
        </div>
      </div>

      {error && (
        <div className="error-alert inline-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="search-hero">
        <div>
          <span>
            <Sparkles size={16} />
            Intelligent Candidate Discovery
          </span>
          <h3>Find the right candidate faster using smart resume filters.</h3>
          <p>
            Combine natural search, required skills, experience, education, and
            contact filters to shortlist candidates quickly.
          </p>
        </div>

        <div className="search-hero-icon">
          <Search size={48} />
        </div>
      </div>

      <div className="panel semantic-search-panel">
        <div className="main-search-box">
          <Search size={24} />
          <input
            placeholder="Search Python developer, FastAPI, MySQL, Chennai, B.Tech, 2 years..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="advanced-filter-grid">
          <div>
            <label className="form-label">Required Skills</label>
            <input
              className="plain-input full"
              placeholder="Python, FastAPI, MySQL"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />
            <small className="helper-text">Separate skills using commas.</small>
          </div>

          <div>
            <label className="form-label">Skill Match</label>
            <select
              className="select-input"
              value={skillMode}
              onChange={(event) => setSkillMode(event.target.value)}
            >
              <option value="any">Match Any Skill</option>
              <option value="all">Match All Skills</option>
            </select>
          </div>

          <div>
            <label className="form-label">Experience</label>
            <input
              className="plain-input full"
              placeholder="2 years, fresher, 1-3"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Education</label>
            <input
              className="plain-input full"
              placeholder="B.Tech, MCA, Computer Science"
              value={education}
              onChange={(event) => setEducation(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Email / Phone</label>
            <input
              className="plain-input full"
              placeholder="email or mobile number"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Sort By</label>
            <select
              className="select-input"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="relevance">Relevance Score</option>
              <option value="recent">Recently Uploaded</option>
              <option value="name">Candidate Name</option>
              <option value="skills">Most Skills</option>
            </select>
          </div>
        </div>

        <div className="search-actions-row">
          <div>
            <Filter size={17} />
            <span>{searchedCandidates.length} candidates matched</span>
          </div>

          <button className="ghost-button clear-filter-button" onClick={clearFilters}>
            <SlidersHorizontal size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {topCandidate && (
        <div className="top-search-match">
          <div className="top-search-icon">
            <Target size={30} />
          </div>

          <div>
            <span>Best Search Match</span>
            <h3>{topCandidate.name || "Name not extracted"}</h3>
            <p>
              {topCandidate.email || "Email unavailable"} •{" "}
              {topCandidate.total_experience || "Experience unavailable"}
            </p>
          </div>

          <div className="search-score-pill">
            {topCandidate.relevanceScore}
            <small>score</small>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header split-header">
          <div>
            <h3>Search Results</h3>
            <p>{searchedCandidates.length} candidate profiles found</p>
          </div>
        </div>

        {searchedCandidates.length > 0 ? (
          <div className="semantic-results-grid">
            {searchedCandidates.map((candidate) => (
              <div className="semantic-candidate-card" key={candidate.id}>
                <div className="semantic-card-top">
                  <div className="candidate-avatar">
                    {candidate.name?.charAt(0)?.toUpperCase() || (
                      <UserRound size={22} />
                    )}
                  </div>

                  <div>
                    <h3>{candidate.name || "Name not extracted"}</h3>
                    <p>{candidate.resume_file_name || "Resume file unavailable"}</p>
                  </div>

                  <div className="relevance-badge">
                    {candidate.relevanceScore}
                    <small>score</small>
                  </div>
                </div>

                <div className="semantic-contact-grid">
                  <div>
                    <Mail size={16} />
                    <span>{candidate.email || "Email not found"}</span>
                  </div>

                  <div>
                    <Phone size={16} />
                    <span>{candidate.phone || "Phone not found"}</span>
                  </div>

                  <div>
                    <BriefcaseBusiness size={16} />
                    <span>{candidate.total_experience || "Experience not found"}</span>
                  </div>
                </div>

                {candidate.education && (
                  <div className="semantic-education-box">
                    {candidate.education}
                  </div>
                )}

                <div className="skill-wrap compact">
                  {candidate.skills?.length > 0 ? (
                    candidate.skills.slice(0, 12).map((skill) => {
                      const isMatched = candidate.matchedSkills?.some(
                        (matchedSkill) =>
                          normalize(skill.skill_name).includes(matchedSkill)
                      );

                      return (
                        <span
                          className={isMatched ? "skill-pill matched" : "skill-pill"}
                          key={skill.id}
                        >
                          {skill.skill_name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="muted-text">No skills extracted</span>
                  )}
                </div>

                <div className="semantic-card-actions">
                  <Link
                    to={`/candidates/${candidate.id}`}
                    className="ghost-button"
                  >
                    View Profile
                  </Link>

                  <Link to="/ai-matching" className="action-button compact-action">
                    Run AI Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No candidates matched your filters. Try changing the search keywords.
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateSearch;
