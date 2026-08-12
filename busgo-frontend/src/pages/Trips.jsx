import { useEffect, useState } from "react";
import api from "../services/api";
import moment from "moment";
import "./Trips.css";

export default function Trips() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("CONFIRMED");

  const load = () => {
    setLoading(true);
    setError("");

    api
      .get("/bookings/mine")
      .then((response) => {
        setItems(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to load bookings:", error);

        setError(
          error.response?.data?.message || "Failed to load your bookings.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      await api.put("/bookings/" + id + "/cancel");
      load();
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      alert(error.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
      case "CANCELED":
        return "status-cancelled";

      case "COMPLETED":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  // =========================
  // FILTER BOOKINGS
  // =========================

  const confirmedItems = items.filter(
    (booking) => booking.status?.toUpperCase() === "CONFIRMED",
  );

  const cancelledItems = items.filter((booking) => {
    const status = booking.status?.toUpperCase();

    return status === "CANCELLED" || status === "CANCELED";
  });

  const filteredItems =
    activeTab === "CONFIRMED" ? confirmedItems : cancelledItems;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="trips-page">
        <div className="trips-container">
          <div className="trips-header">
            <div>
              <div className="skeleton skeleton-small"></div>
              <div className="skeleton skeleton-title"></div>
            </div>
          </div>

          <div className="trip-list">
            {[1, 2].map((item) => (
              <div className="trip-skeleton" key={item}>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line short"></div>
                <div className="skeleton skeleton-box"></div>
                <div className="skeleton skeleton-line"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="trips-page">
        <div className="trips-container">
          <div className="trip-error">
            <div className="error-icon">!</div>

            <h2>Unable to load trips</h2>

            <p>{error}</p>

            <button className="retry-btn" onClick={load}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="trips-page">
      <div className="trips-container">
        {/* =========================
            HEADER
        ========================= */}

        <header className="trips-header">
          <div>
            <h1>My Bookings</h1>

            <p>Manage your upcoming and previous bus bookings.</p>
          </div>

          <div className="booking-count">
            <strong>{items.length}</strong>
            <span>Bookings</span>
          </div>
        </header>

        {/* =========================
            CONFIRMED / CANCELLED TABS
        ========================= */}

        <div className="trip-tabs">
          {/* CONFIRMED */}

          <button
            className={activeTab === "CONFIRMED" ? "active" : ""}
            onClick={() => setActiveTab("CONFIRMED")}
          >
            <span className="tab-icon confirmed-icon">✓</span>

            <span>Confirmed</span>

            <span className="tab-count">{confirmedItems.length}</span>
          </button>

          {/* CANCELLED */}

          <button
            className={activeTab === "CANCELLED" ? "active cancelled-tab" : ""}
            onClick={() => setActiveTab("CANCELLED")}
          >
            <span className="tab-icon cancelled-icon">×</span>

            <span>Cancelled</span>

            <span className="tab-count">{cancelledItems.length}</span>
          </button>
        </div>

        {/* =========================
            EMPTY
        ========================= */}

        {filteredItems.length === 0 ? (
          <section className="empty-trips">
            <div className="empty-trip-icon">
              {activeTab === "CONFIRMED" ? "🚌" : "×"}
            </div>

            <h2>
              {activeTab === "CONFIRMED"
                ? "No confirmed trips"
                : "No cancelled trips"}
            </h2>

            <p>
              {activeTab === "CONFIRMED"
                ? "You don't have any confirmed bus bookings yet. Find a bus and book your next journey."
                : "You don't have any cancelled bus bookings."}
            </p>

            {activeTab === "CONFIRMED" && (
              <button
                className="find-bus-btn"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Find a Bus →
              </button>
            )}
          </section>
        ) : (
          /* =========================
             TRIP LIST
          ========================= */

          <section className="trip-list">
            {filteredItems.map((booking) => {
              const schedule = booking.schedule;
              const bus = schedule?.bus;

              return (
                <article className="trip-card" key={booking.id}>
                  {/* =========================
                      TOP
                  ========================= */}

                  <div className="ticket-top">
                    <div className="operator">
                      <div className="operator-icon">🚌</div>

                      <div>
                        <strong>{bus?.operatorName || "Bus Operator"}</strong>

                        <span>{bus?.busNumber || "Bus"}</span>
                      </div>
                    </div>

                    <div
                      className={`booking-status ${getStatusClass(
                        booking.status,
                      )}`}
                    >
                      <span className="status-dot"></span>

                      {booking.status}
                    </div>
                  </div>

                  {/* =========================
                      ROUTE
                  ========================= */}

                  <div className="route-section">
                    {/* DEPARTURE */}

                    <div className="route-city">
                      <span className="route-time">
                        {schedule?.departureTime
                          ? moment(schedule.departureTime).format(
                              "ddd, DD MMM YYYY",
                            )
                          : "--"}
                      </span>

                      <span className="route-clock">
                        {schedule?.departureTime
                          ? moment(schedule.departureTime).format("hh:mm A")
                          : "--"}
                      </span>

                      <strong>{schedule?.fromCity || "--"}</strong>

                      <small>Departure</small>
                    </div>

                    {/* ROUTE LINE */}

                    <div className="route-progress">
                      <span className="route-dot"></span>

                      <div className="route-line">
                        <span>BUS</span>
                      </div>

                      <span className="route-dot"></span>
                    </div>

                    {/* ARRIVAL */}

                    <div className="route-city arrival">
                      <span className="route-time">
                        {schedule?.arrivalTime
                          ? moment(schedule.arrivalTime).format(
                              "ddd, DD MMM YYYY",
                            )
                          : "--"}
                      </span>

                      <span className="route-clock">
                        {schedule?.arrivalTime
                          ? moment(schedule.arrivalTime).format("hh:mm A")
                          : "--"}
                      </span>

                      <strong>{schedule?.toCity || "--"}</strong>

                      <small>Arrival</small>
                    </div>
                  </div>

                  {/* =========================
                      JOURNEY DETAILS
                  ========================= */}

                  <div className="journey-details">
                    {/* JOURNEY DATE */}

                    <div className="detail-item">
                      <span className="detail-icon">📅</span>

                      <div>
                        <small>Journey Date</small>

                        <strong>
                          {schedule?.journeyDate
                            ? moment(schedule.journeyDate).format(
                                "ddd, DD MMM YYYY",
                              )
                            : "-"}
                        </strong>
                      </div>
                    </div>

                    {/* SEATS */}

                    <div className="detail-item">
                      <span className="detail-icon">💺</span>

                      <div>
                        <small>Seats</small>

                        <strong className="seat-list">
                          {booking.seatNumbers?.length
                            ? booking.seatNumbers.map((seat) => (
                                <span className="seat-chip" key={seat}>
                                  {seat}
                                </span>
                              ))
                            : "No seats"}
                        </strong>
                      </div>
                    </div>

                    {/* BUS TYPE */}

                    <div className="detail-item">
                      <span className="detail-icon">🚌</span>

                      <div>
                        <small>Bus Type</small>

                        <strong>{bus?.busType || "Standard"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* =========================
                      DIVIDER
                  ========================= */}

                  <div className="ticket-divider">
                    <span></span>

                    <div></div>

                    <span></span>
                  </div>

                  {/* =========================
                      FOOTER
                  ========================= */}

                  <div className="trip-footer">
                    {/* BOOKING INFO */}

                    <div className="booking-info">
                      <span>Booking ID</span>

                      <strong>{booking.id}</strong>

                      <small>
                        Booked{" "}
                        {booking.createdAt
                          ? moment(booking.createdAt).format(
                              "DD MMM YYYY, hh:mm A",
                            )
                          : "-"}
                      </small>
                    </div>

                    {/* FARE */}

                    <div className="fare-info">
                      <span>Total Fare</span>

                      <strong>
                        ₹
                        {Number(booking.totalFare || 0).toLocaleString("en-IN")}
                      </strong>

                      <small>{booking.seatNumbers?.length || 0} seat(s)</small>
                    </div>

                    {/* CANCEL */}

                    {booking.status?.toUpperCase() === "CONFIRMED" && (
                      <button
                        className="cancel-btn"
                        onClick={() => cancel(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
