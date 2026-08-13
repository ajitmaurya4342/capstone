import moment from "moment";

export default function BusCard({ schedule, onSelectSeats }) {
  const bus = schedule?.bus;

  return (
    <article className="bus-card">
      {/* OPERATOR */}
      <div className="bus-company">
        <div className="bus-logo">🚌</div>

        <div>
          <h3>{bus?.operatorName || "Bus Operator"}</h3>

          <span className="bus-type">{bus?.busType || "SEATER"}</span>
        </div>
      </div>

      {/* JOURNEY */}
      <div className="journey-time">
        {/* DEPARTURE */}
        <div className="time-block">
          <strong>
            {schedule?.departureTime
              ? moment(schedule.departureTime).format("ddd, DD MMM YYYY")
              : "--"}
          </strong>

          <strong>
            {schedule?.departureTime
              ? moment(schedule.departureTime).format("hh:mm A")
              : "--"}
          </strong>

          <span>{schedule?.fromCity}</span>
        </div>

        {/* JOURNEY LINE */}
        <div className="journey-line">
          <span>●</span>
          <div></div>
          <span>●</span>
        </div>

        {/* ARRIVAL */}
        <div className="time-block">
          <strong>
            {schedule?.arrivalTime
              ? moment(schedule.arrivalTime).format("ddd, DD MMM YYYY")
              : "--"}
          </strong>

          <strong>
            {schedule?.arrivalTime
              ? moment(schedule.arrivalTime).format("hh:mm A")
              : "--"}
          </strong>

          <span>{schedule?.toCity}</span>
        </div>
      </div>

      {/* PRICE + BUTTON */}
      <div className="bus-price">
        <span className="starting">Starting from</span>

        <strong>₹{schedule?.fare ?? 0}</strong>

        <span className="per-seat">per seat</span>

        <button className="seat-btn" onClick={() => onSelectSeats(schedule.id)}>
          Select Seats
        </button>
      </div>
    </article>
  );
}
