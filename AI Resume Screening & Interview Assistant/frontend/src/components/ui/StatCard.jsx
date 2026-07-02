function StatCard({ title, value, icon: Icon, trend, tone = "blue" }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-card-header">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="stat-icon">
          <Icon size={22} />
        </div>
      </div>

      {trend && <span className="stat-trend">{trend}</span>}
    </div>
  );
}

export default StatCard;
