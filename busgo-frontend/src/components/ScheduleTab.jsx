import BusCard from "./BusCard";

export default function ScheduleTab({ results, from, to, onSelectSeats }) {
  return (
    <section className="results-section">
      <div className="section-container">
        {/* HEADER */}
        <div className="results-title">
          <div>
            <span className="section-label">AVAILABLE BUSES</span>

            <h2>
              {from} → {to}
            </h2>

            <p>{results.length} buses available for your journey</p>
          </div>
        </div>

        {/* BUS LIST */}
        <div className="bus-list">
          {results.map((schedule) => (
            <BusCard
              key={schedule.id}
              schedule={schedule}
              onSelectSeats={onSelectSeats}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
