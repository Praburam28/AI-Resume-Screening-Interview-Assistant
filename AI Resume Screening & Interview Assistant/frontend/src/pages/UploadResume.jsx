import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2,
  UploadCloud,
} from "lucide-react";
import api from "../api/axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSuccess("");
    setError("");
    setCandidate(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
      setSuccess("");
      setError("");
      setCandidate(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF or DOCX resume.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setSuccess("");
    setCandidate(null);

    try {
      const response = await api.post("/candidates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCandidate(response.data);
      setSuccess("Resume uploaded and candidate profile extracted successfully.");
      setFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Resume upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Candidate Management</p>
          <h2>Upload Resume</h2>
          <p>
            Upload PDF or DOCX resumes and automatically extract candidate
            details, skills, education, and experience.
          </p>
        </div>
      </div>

      <div className="upload-grid">
        <div className="panel upload-panel">
          <form onSubmit={handleSubmit}>
            <div
              className={dragActive ? "dropzone active" : "dropzone"}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="dropzone-icon">
                <UploadCloud size={42} />
              </div>

              <h3>Drop resume here</h3>
              <p>Supports PDF and DOCX files</p>

              <label className="file-picker">
                Browse Resume
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              {file && (
                <div className="selected-file">
                  <FileUp size={18} />
                  <span>{file.name}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="error-alert inline-alert">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-alert inline-alert">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Processing Resume...
                </>
              ) : (
                "Upload & Extract Candidate"
              )}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Extraction Preview</h3>
              <p>Candidate information appears here after upload.</p>
            </div>
          </div>

          {candidate ? (
            <div className="candidate-preview">
              <div className="candidate-avatar-lg">
                {candidate.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <h3>{candidate.name || "Name not extracted"}</h3>
              <p>{candidate.email || "Email not found"}</p>

              <div className="detail-list">
                <div>
                  <span>Phone</span>
                  <strong>{candidate.phone || "Not found"}</strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>{candidate.total_experience || "Not found"}</strong>
                </div>

                <div>
                  <span>Resume</span>
                  <strong>{candidate.resume_file_name}</strong>
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
                  <span className="muted-text">No skills extracted</span>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              Upload a resume to preview extracted candidate data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadResume;
