import { Construction } from "lucide-react";

function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">
          <Construction size={40} />
        </div>

        <h2>{title}</h2>
        <p>{description}</p>

        <div className="placeholder-badge">
          UI module will be connected in the next frontend phase.
        </div>
      </div>
    </div>
  );
}

export default PlaceholderPage;
