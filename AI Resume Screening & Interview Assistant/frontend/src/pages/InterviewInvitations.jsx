import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Mail,
  Send,
  Loader2,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";
import api from "../api/axios";

function InterviewInvitations() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    candidate_id: "",
    job_id: "",
    recipient_email: "",
    interview_datetime: "",
    meeting_link: "",
    custom_message: "",
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedCandidate = useMemo(() => {
    return candidates.find((item) => String(item.id) === String(form.candidate_id));
  }, [candidates, form.candidate_id]);

  const selectedJob = useMemo(() => {
    return jobs.find((item) => String(item.id) === String(form.job_id));
  }, [jobs, form.job_id]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [candidateRes, jobRes, historyRes] = await Promise.allSettled([
        api.get("/candidates/"),
        api.get("/jobs/"),
        api.get("/invitations/history"),
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
    } catch {
      setError("Failed to load invitation data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCandidateChange = (event) => {
    const candidateId = event.target.value;
    const candidate = candidates.find((item) => String(item.id) === String(candidateId));

    setForm({
      ...form,
      candidate_id: candidateId,
      recipient_email: candidate?.email || "",
    });
  };

  const sendInvitation = async (event) => {
    event.preventDefault();

    if (!form.candidate_id || !form.job_id) {
      setError("Please select candidate and job.");
      return;
    }

    setSending(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        candidate_id: Number(form.candidate_id),
        job_id: Number(form.job_id),
        recipient_email: form.recipient_email || null,
        interview_datetime: form.interview_datetime || null,
        meeting_link: form.meeting_link || null,
        custom_message: form.custom_message || null,
      };

      const response = await api.post("/invitations/send", payload);

      if (response.data.status === "sent") {
        setMessage("Interview invitation sent successfully.");
      } else if (response.data.status === "drafted") {
        setMessage("SMTP is not configured. Invitation saved as draft.");
      } else {
        setMessage("Invitation saved, but email sending failed.");
      }

      setForm({
        candidate_id: "",
        job_id: "",
        recipient_email: "",
        interview_datetime: "",
        meeting_link: "",
        custom_message: "",
      });

      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to send interview invitation."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spin" size={34} />
        <p>Loading interview invitations...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Interview Scheduling</p>
          <h2>Email Interview Invitations</h2>
          <p>
            Send interview invitations to candidates or save invitation drafts
            when SMTP is not configured.
          </p>
        </div>

        <div className="ai-badge">
          <Mail size={20} />
          Invitation Center
        </div>
      </div>

      {message && (
        <div className="success-alert inline-alert">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && <div className="error-alert">{error}</div>}

      <div className="question-workspace-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Send Invitation</h3>
              <p>Select a candidate and job, then prepare interview details.</p>
            </div>
          </div>

          <form className="ai-form-stack" onSubmit={sendInvitation}>
            <div>
              <label className="form-label">Candidate</label>
              <select
                className="select-input large-select"
                name="candidate_id"
                value={form.candidate_id}
                onChange={handleCandidateChange}
                required
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
                name="job_id"
                value={form.job_id}
                onChange={handleChange}
                required
              >
                <option value="">Choose job</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.job_title} — {job.location || "No location"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Recipient Email</label>
              <input
                className="plain-input full"
                name="recipient_email"
                value={form.recipient_email}
                onChange={handleChange}
                placeholder="candidate@email.com"
              />
            </div>

            <div>
              <label className="form-label">Interview Date & Time</label>
              <input
                className="plain-input full"
                name="interview_datetime"
                value={form.interview_datetime}
                onChange={handleChange}
                placeholder="Example: 10 July 2026, 11:00 AM"
              />
            </div>

            <div>
              <label className="form-label">Meeting Link</label>
              <input
                className="plain-input full"
                name="meeting_link"
                value={form.meeting_link}
                onChange={handleChange}
                placeholder="Google Meet / Zoom link"
              />
            </div>

            <div>
              <label className="form-label">Custom Message</label>
              <textarea
                className="job-textarea"
                name="custom_message"
                value={form.custom_message}
                onChange={handleChange}
                placeholder="Add any extra message for the candidate..."
              />
            </div>

            <button className="primary-button" type="submit" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Invitation
                </>
              )}
            </button>
          </form>
        </div>

        <div className="panel selected-context-card">
          <div className="panel-header">
            <div>
              <h3>Invitation Preview</h3>
              <p>Selected candidate and job details.</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon">
              <UserRound size={22} />
            </div>

            <div>
              <span>Candidate</span>
              <h4>{selectedCandidate?.name || "No candidate selected"}</h4>
              <p>{selectedCandidate?.email || "Email unavailable"}</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon job">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <span>Job Role</span>
              <h4>{selectedJob?.job_title || "No job selected"}</h4>
              <p>{selectedJob?.location || "Location unavailable"}</p>
            </div>
          </div>

          <div className="context-card">
            <div className="context-icon job">
              <CalendarClock size={22} />
            </div>

            <div>
              <span>Schedule</span>
              <h4>{form.interview_datetime || "Not selected"}</h4>
              <p>{form.meeting_link || "Meeting link not added"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Invitation History</h3>
            <p>Previously sent or drafted interview invitations.</p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <div className="history-icon summary">
                  <Mail size={20} />
                </div>

                <div>
                  <h4>{item.subject}</h4>
                  <p>
                    To: {item.recipient_email} • Status: {item.status}
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
          <div className="empty-state">No invitation history found.</div>
        )}
      </div>
    </div>
  );
}

export default InterviewInvitations;