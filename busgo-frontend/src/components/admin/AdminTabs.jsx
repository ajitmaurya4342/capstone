export default function AdminTabs({
  activeTab,
  setActiveTab,
  busCount,
  scheduleCount,
}) {
  return (
    <div className="admin-tabs">
      <button
        className={activeTab === "buses" ? "admin-tab active" : "admin-tab"}
        onClick={() => setActiveTab("buses")}
      >
        <span className="tab-icon">🚌</span>

        <span>
          <strong>Buses</strong>
          <small>Bus management</small>
        </span>

        <b>{busCount}</b>
      </button>

      <button
        className={activeTab === "schedules" ? "admin-tab active" : "admin-tab"}
        onClick={() => setActiveTab("schedules")}
      >
        <span className="tab-icon">🗓</span>

        <span>
          <strong>Schedules</strong>
          <small>Routes & journeys</small>
        </span>

        <b>{scheduleCount}</b>
      </button>
    </div>
  );
}
