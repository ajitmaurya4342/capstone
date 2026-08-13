import { useMemo, useState } from "react";
import moment from "moment";

export default function ScheduleTable({ schedules, onEdit }) {
  const [search, setSearch] = useState("");
  const [viewSchedule, setViewSchedule] = useState(null);

  const formatDate = (date) => {
    if (!date) return "—";

    return moment(date).format("DD MMM YYYY");
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return moment(date).format("hh:mm A");
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return moment(date).format("DD MMM YYYY, hh:mm A");
  };

  const filteredSchedules = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return schedules;
    }

    return schedules.filter((schedule) => {
      const searchableData = [
        schedule.id,
        schedule.fromCity,
        schedule.toCity,

        schedule.busId,
        schedule.bus?.id,
        schedule.bus?.busNumber,
        schedule.bus?.operatorName,
        schedule.bus?.busType,

        schedule.journeyDate,
        schedule.departureTime,
        schedule.arrivalTime,

        formatDate(schedule.journeyDate),
        formatTime(schedule.departureTime),
        formatTime(schedule.arrivalTime),
        formatDateTime(schedule.departureTime),
        formatDateTime(schedule.arrivalTime),

        schedule.fare,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      return searchableData.includes(query);
    });
  }, [schedules, search]);

  return (
    <>
      <div className="list-panel">
        {/* HEADER */}
        <div className="list-header">
          <div>
            <span className="panel-kicker">JOURNEYS</span>

            <h2>Schedule Management</h2>

            <p className="list-description">
              Manage all routes, timings and fares
            </p>
          </div>

          <span className="count-pill">
            {filteredSchedules.length}
            {filteredSchedules.length !== schedules.length &&
              ` / ${schedules.length}`}{" "}
            schedules
          </span>
        </div>

        {/* SEARCH */}
        <div className="schedule-toolbar">
          <div className="schedule-search">
            <span className="search-icon">⌕</span>

            <input
              type="search"
              placeholder="Search route, bus, operator, date, time or fare..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {search && (
            <span className="search-results">
              {filteredSchedules.length} result
              {filteredSchedules.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* TABLE */}
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>ACTION</th>
                <th>ROUTE</th>
                <th>BUS</th>
                <th>DATE</th>
                <th>DEPARTURE</th>
                <th>ARRIVAL</th>
                <th>FARE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan="8" className="schedule-empty-cell">
                    <div className="schedule-empty-icon">
                      {search ? "⌕" : "🗓️"}
                    </div>

                    <strong>No schedules found</strong>

                    <span>
                      {search
                        ? `No schedule matches "${search}".`
                        : "Create a journey using the form above."}
                    </span>

                    {search && (
                      <button
                        type="button"
                        className="empty-clear-button"
                        onClick={() => setSearch("")}
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    {/* ACTION */}
                    <td>
                      <div className="schedule-actions">
                        <button
                          type="button"
                          className="view-button"
                          onClick={() => setViewSchedule(schedule)}
                          title="View schedule"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => onEdit(schedule)}
                          title="Edit schedule"
                        >
                          ✎
                        </button>
                      </div>
                    </td>

                    {/* ROUTE */}
                    <td>
                      <div className="route-cell">
                        <div className="city">
                          <strong>{schedule.fromCity || "—"}</strong>
                        </div>

                        <span className="route-arrow">→</span>

                        <div className="city">
                          <strong>{schedule.toCity || "—"}</strong>
                        </div>
                      </div>
                    </td>

                    {/* BUS */}
                    <td>
                      <div className="bus-table-cell">
                        <div className="bus-mini-icon">🚌</div>

                        <div>
                          <strong>
                            {schedule.bus?.busNumber || schedule.busId || "—"}
                          </strong>

                          {schedule.bus?.operatorName && (
                            <small>{schedule.bus.operatorName}</small>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DATE */}
                    <td>
                      <div className="date-cell">
                        <strong>{formatDate(schedule.journeyDate)}</strong>
                      </div>
                    </td>

                    {/* DEPARTURE */}
                    <td>
                      <div className="time-cell">
                        <strong>
                          {formatDateTime(schedule.departureTime)}
                        </strong>

                        <small>Departure</small>
                      </div>
                    </td>

                    {/* ARRIVAL */}
                    <td>
                      <div className="time-cell">
                        <strong>{formatDateTime(schedule.arrivalTime)}</strong>

                        <small>Arrival</small>
                      </div>
                    </td>

                    {/* FARE */}
                    <td>
                      <strong className="fare">₹{schedule.fare ?? "0"}</strong>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="status-badge">
                        <i />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewSchedule && (
        <div
          className="schedule-modal-overlay"
          onClick={() => setViewSchedule(null)}
        >
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="schedule-modal-header">
              <div>
                <span className="panel-kicker">SCHEDULE DETAILS</span>

                <h2>
                  {viewSchedule.fromCity}
                  <span className="modal-route-arrow">→</span>
                  {viewSchedule.toCity}
                </h2>

                <p>Schedule #{viewSchedule.id}</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setViewSchedule(null)}
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="schedule-details">
              <div className="detail-item">
                <span>Schedule ID</span>
                <strong>#{viewSchedule.id}</strong>
              </div>

              <div className="detail-item">
                <span>From City</span>
                <strong>{viewSchedule.fromCity || "—"}</strong>
              </div>

              <div className="detail-item">
                <span>To City</span>
                <strong>{viewSchedule.toCity || "—"}</strong>
              </div>

              <div className="detail-item">
                <span>Bus Number</span>
                <strong>
                  {viewSchedule.bus?.busNumber || viewSchedule.busId || "—"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Operator</span>
                <strong>{viewSchedule.bus?.operatorName || "—"}</strong>
              </div>

              <div className="detail-item">
                <span>Bus Type</span>
                <strong>{viewSchedule.bus?.busType || "—"}</strong>
              </div>

              <div className="detail-item">
                <span>Journey Date</span>
                <strong>{formatDate(viewSchedule.journeyDate)}</strong>
              </div>

              <div className="detail-item">
                <span>Departure</span>
                <strong>{formatDateTime(viewSchedule.departureTime)}</strong>
              </div>

              <div className="detail-item">
                <span>Arrival</span>
                <strong>{formatDateTime(viewSchedule.arrivalTime)}</strong>
              </div>

              <div className="detail-item">
                <span>Fare</span>
                <strong className="detail-fare">
                  ₹{viewSchedule.fare ?? "0"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>

                <strong>
                  <span className="status-badge">
                    <i />
                    Active
                  </span>
                </strong>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="schedule-modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setViewSchedule(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  onEdit(viewSchedule);
                  setViewSchedule(null);
                }}
              >
                ✎ Edit Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
