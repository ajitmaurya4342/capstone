export default function AdminStats({ buses, schedules }) {
  const totalSeats = buses.reduce(
    (total, bus) => total + Number(bus.totalSeats || 0),
    0,
  );

  const operators = new Set(buses.map((bus) => bus.operatorName)).size;

  const stats = [
    {
      label: "Total Buses",
      value: buses.length,
      icon: "🚌",
      className: "blue",
    },
    {
      label: "Schedules",
      value: schedules.length,
      icon: "🗓",
      className: "purple",
    },
    // {
    //   label: "Total Seats",
    //   value: totalSeats,
    //   icon: "💺",
    //   className: "green",
    // },
    // {
    //   label: "Operators",
    //   value: operators,
    //   icon: "◉",
    //   className: "orange",
    // },
  ];

  return (
    <section className="admin-stats">
      {stats.map((stat) => (
        <div className={`stat-card ${stat.className}`} key={stat.label}>
          <div className="stat-icon">{stat.icon}</div>

          <div className="stat-content">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}
