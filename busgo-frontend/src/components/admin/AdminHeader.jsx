export default function AdminHeader({ loading, onRefresh }) {
  return (
    <header className="admin-header">
      <div className="admin-title">
        <div className="admin-logo">🚌</div>

        <div>
          <span className="admin-eyebrow">BUSGO ADMIN</span>

          <h1>Operations Dashboard</h1>

          <p>Manage your buses, routes and journey schedules from one place.</p>
        </div>
      </div>

      <button className="refresh-button" onClick={onRefresh} disabled={loading}>
        <span className={loading ? "spin" : ""}>↻</span>

        {loading ? "Refreshing" : "Refresh"}
      </button>
    </header>
  );
}
