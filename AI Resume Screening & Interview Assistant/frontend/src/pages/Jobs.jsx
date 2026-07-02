import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  job_title: "",
  required_skills: "",
  experience_requirement: "",
  location: "",
  employment_type: "Full Time",
  job_description_content: "",
};

function Jobs() {
  const { user } = useAuth();

  const isHR = user?.role === "HR";

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingJobId, setEditingJobId] = useState(null);

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formTitle = editingJobId ? "Update Job Description" : "Create Job Description";
  const formButtonText = editingJobId ? "Update Job" : "Create Job";

  const totalJobs = jobs.length;

  const totalSkills = useMemo(() => {
    const skillSet = new Set();

    jobs.forEach((job) => {
      job.required_skills?.forEach((skillItem) => {
        if (skillItem.skill_name) {
          skillSet.add(skillItem.skill_name.toLowerCase());
        }
      });
    });

    return skillSet.size;
  }, [jobs]);

  const loadJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (skill) params.append("skill", skill);
      if (location) params.append("location", location);
      if (employmentType) params.append("employment_type", employmentType);

      const response = await api.get("/jobs/?" + params.toString());
      setJobs(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load job descriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const parseSkills = (skillText) => {
    return skillText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingJobId(null);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isHR) {
      setError("Only HR users can create or update job descriptions.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      job_title: form.job_title,
      required_skills: parseSkills(form.required_skills),
      experience_requirement: form.experience_requirement,
      location: form.location,
      employment_type: form.employment_type,
      job_description_content: form.job_description_content,
    };

    try {
      if (editingJobId) {
        await api.put("/jobs/" + editingJobId, payload);
        setSuccess("Job description updated successfully.");
      } else {
        await api.post("/jobs/", payload);
        setSuccess("Job description created successfully.");
      }

      resetForm();
      await loadJobs();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to save job description."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);

    setForm({
      job_title: job.job_title || "",
      required_skills:
        job.required_skills?.map((item) => item.skill_name).join(", ") || "",
      experience_requirement: job.experience_requirement || "",
      location: job.location || "",
      employment_type: job.employment_type || "Full Time",
      job_description_content: job.job_description_content || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (jobId) => {
    if (!isHR) {
      alert("Only HR users can delete job descriptions.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this job description?"
    );

    if (!confirmed) return;

    try {
      await api.delete("/jobs/" + jobId);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Delete failed. Only HR users can delete jobs."
      );
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadJobs();
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Job Description Management</p>
          <h2>Jobs & Hiring Roles</h2>
          <p>
            Create, update, search, and manage job descriptions with required
            skills, experience, location, and employment type.
          </p>
        </div>

        <div className="job-summary-strip">
          <div>
            <span>Total Jobs</span>
            <strong>{totalJobs}</strong>
          </div>

          <div>
            <span>Unique Skills</span>
            <strong>{totalSkills}</strong>
          </div>
        </div>
      </div>

      <div className="job-layout-grid">
        <div className="panel job-form-panel">
          <div className="panel-header split-header">
            <div>
              <h3>{formTitle}</h3>
              <p>
                {isHR
                  ? "Add a new hiring role or update an existing one."
                  : "Only HR users can create and update job descriptions."}
              </p>
            </div>

            <div className="header-icon">
              {editingJobId ? <Edit3 size={22} /> : <Plus size={22} />}
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}
          {success && <div className="success-alert">{success}</div>}

          <form className="job-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label>Job Title</label>
                <input
                  name="job_title"
                  className="plain-input full"
                  placeholder="Python Developer"
                  value={form.job_title}
                  onChange={handleChange}
                  required
                  disabled={!isHR}
                />
              </div>

              <div>
                <label>Experience Requirement</label>
                <input
                  name="experience_requirement"
                  className="plain-input full"
                  placeholder="1-3 years"
                  value={form.experience_requirement}
                  onChange={handleChange}
                  disabled={!isHR}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Location</label>
                <input
                  name="location"
                  className="plain-input full"
                  placeholder="Chennai"
                  value={form.location}
                  onChange={handleChange}
                  disabled={!isHR}
                />
              </div>

              <div>
                <label>Employment Type</label>
                <select
                  name="employment_type"
                  className="select-input"
                  value={form.employment_type}
                  onChange={handleChange}
                  disabled={!isHR}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label>Required Skills</label>
              <input
                name="required_skills"
                className="plain-input full"
                placeholder="Python, FastAPI, MySQL, REST API, Git"
                value={form.required_skills}
                onChange={handleChange}
                disabled={!isHR}
              />
              <small className="helper-text">
                Separate skills using commas.
              </small>
            </div>

            <div>
              <label>Job Description Content</label>
              <textarea
                name="job_description_content"
                className="job-textarea"
                placeholder="Write the full job description, responsibilities, qualifications, and expectations..."
                value={form.job_description_content}
                onChange={handleChange}
                required
                disabled={!isHR}
              />
            </div>

            <div className="form-actions">
              <button
                className="primary-button inline-primary"
                type="submit"
                disabled={saving || !isHR}
              >
                {saving ? (
                  <>
                    <Loader2 className="spin" size={18} />
                    Saving...
                  </>
                ) : (
                  formButtonText
                )}
              </button>

              {editingJobId && (
                <button
                  type="button"
                  className="ghost-button inline-ghost"
                  onClick={resetForm}
                >
                  <X size={16} />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel job-help-card">
          <div className="job-help-icon">
            <BriefcaseBusiness size={34} />
          </div>

          <h3>Professional Job Setup</h3>
          <p>
            Add clear job descriptions so the AI matching engine can compare
            candidate skills, resume content, experience, and role suitability.
          </p>

          <div className="job-checklist">
            <span>Use specific required skills</span>
            <span>Add experience requirement</span>
            <span>Mention location and employment type</span>
            <span>Write detailed responsibilities</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Search Job Descriptions</h3>
            <p>Filter jobs by title, skill, location, or employment type.</p>
          </div>
        </div>

        <form className="job-filter-grid" onSubmit={handleSearch}>
          <div className="filter-input">
            <Search size={18} />
            <input
              placeholder="Search by title or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <input
            className="plain-input"
            placeholder="Skill"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
          />

          <input
            className="plain-input"
            placeholder="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <select
            className="select-input compact-select"
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <button className="small-primary-button" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header split-header">
          <div>
            <h3>All Job Descriptions</h3>
            <p>{jobs.length} job descriptions found</p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <Loader2 className="spin" size={30} />
            <p>Loading job descriptions...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="jobs-card-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-header">
                  <div className="job-card-icon">
                    <BriefcaseBusiness size={22} />
                  </div>

                  <div>
                    <h3>{job.job_title}</h3>
                    <p>{job.employment_type || "Employment type not set"}</p>
                  </div>
                </div>

                <div className="job-meta-row">
                  <span>
                    <MapPin size={15} />
                    {job.location || "Location not set"}
                  </span>

                  <span>
                    {job.experience_requirement || "Experience not set"}
                  </span>
                </div>

                <div className="job-description-preview">
                  {job.job_description_content}
                </div>

                <div className="skill-wrap compact">
                  {job.required_skills?.length > 0 ? (
                    job.required_skills.map((skillItem) => (
                      <span className="skill-pill" key={skillItem.id}>
                        {skillItem.skill_name}
                      </span>
                    ))
                  ) : (
                    <span className="muted-text">No required skills added</span>
                  )}
                </div>

                <div className="candidate-actions">
                  <button
                    className="ghost-button"
                    onClick={() => handleEdit(job)}
                    disabled={!isHR}
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => handleDelete(job.id)}
                    disabled={!isHR}
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
            No job descriptions found. Create a new job to begin.
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
