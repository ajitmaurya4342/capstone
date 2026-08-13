import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Seats.css";

export default function Seats() {
  const { id } = useParams();
  const nav = useNavigate();

  const { user } = useAuth();

  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  /*
   * Load schedule + booked seats
   */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [seatsResponse, scheduleResponse] = await Promise.all([
          api.get(`/schedules/${id}/seats`),
          api.get(`/schedules/${id}`),
        ]);

        console.log(seatsResponse.data);

        setBooked(seatsResponse.data || []);
        setSchedule(scheduleResponse.data);
      } catch (error) {
        console.error(error);

        /*
         * If /schedules/:id is not available,
         * remove scheduleResponse and use
         * the schedule data passed from Home.
         */
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /*
   * Bus fare
   */
  const fare = Number(schedule?.fare || schedule?.price || 0);

  /*
   * Total
   */
  const total = useMemo(() => {
    return selected.length * fare;
  }, [selected, fare]);

  /*
   * Seat selection
   */
  const toggleSeat = (seat) => {
    if (booked.includes(seat)) {
      return;
    }

    setSelected((current) => {
      if (current.includes(seat)) {
        return current.filter((item) => item !== seat);
      }

      if (current.length >= 4) {
        alert("Maximum 4 Seats Allowed");
        return current;
      }

      return [...current, seat];
    });
  };

  /*
   * Booking
   */
  const book = async () => {
    if (!user) {
      alert("Login required to book your seat");
      return;
    }

    if (!selected.length) {
      return;
    }

    try {
      setBooking(true);

      await api.post("/bookings", {
        scheduleId: id,
        seatNumbers: selected,
      });

      nav("/trips");
    } catch (e) {
      alert(e.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  /*
   * Render a seat
   */
  const Seat = ({ number }) => {
    const isBooked = booked.includes(number);
    const isSelected = selected.includes(number);

    return (
      <button
        type="button"
        className={`bus-seat ${isBooked ? "seat-booked" : ""} ${
          isSelected ? "seat-selected" : ""
        }`}
        disabled={isBooked}
        onClick={() => toggleSeat(number)}
        title={
          isBooked ? `Seat ${number} unavailable` : `Select seat ${number}`
        }
      >
        <span className="seat-shape">{isBooked ? "×" : "●"}</span>

        <span className="seat-number">{number}</span>
      </button>
    );
  };

  /*
   * 10 rows × 4 seats
   *
   * A B | C D
   */
  const rows = Array.from({ length: 10 }, (_, index) => index + 1);

  if (loading) {
    return (
      <main className="seat-page loading-page">
        <div className="loading-card">
          <div className="loading-bus">🚌</div>

          <h2>Loading your bus...</h2>

          <p>Getting the latest seat availability</p>
        </div>
      </main>
    );
  }

  return (
    <main className="seat-page">
      {/* =====================================================
          JOURNEY HEADER
      ===================================================== */}

      <section className="journey-header">
        <div className="journey-main">
          <h1>Choose your seat</h1>

          <p className="journey-subtitle">
            Select up to 4 seats for your journey
          </p>
        </div>

        {/* BUS INFORMATION */}

        <div className="operator-card">
          <div className="operator-icon">🚌</div>

          <div>
            <strong>{schedule?.bus?.operatorName || "Bus Operator"}</strong>

            <span>{schedule?.bus?.busType || "AC Seater"}</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          JOURNEY INFORMATION
      ===================================================== */}

      <section className="journey-card">
        <div className="journey-meta">
          <div>
            <span>DEPARTURE</span>

            <strong>
              {schedule?.departureTime
                ? moment(schedule.departureTime).format("ddd, DD MMM YYYY")
                : "--"}{" "}
              {schedule?.departureTime
                ? moment(schedule.departureTime).format("hh:mm A")
                : "--"}
            </strong>
          </div>

          <div>
            <span>ARRIVAL</span>

            <strong>
              {schedule?.arrivalTime
                ? moment(schedule.arrivalTime).format("ddd, DD MMM YYYY")
                : "--"}{" "}
              {schedule?.arrivalTime
                ? moment(schedule.arrivalTime).format("hh:mm A")
                : "--"}
            </strong>
          </div>

          <div>
            <span>FARE / SEAT</span>

            <strong>₹{fare}</strong>
          </div>
        </div>
        <div className="journey-route">
          <div className="location">
            <span className="time">
              {schedule?.departureTime
                ? moment(schedule.departureTime).format("hh:mm A")
                : "--:--"}
            </span>

            <strong>{schedule?.fromCity || "Departure"}</strong>
          </div>

          <div className="route-visual">
            <span className="route-dot">●</span>

            <div className="route-line">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="route-bus">🚌</span>

            <div className="route-line">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="route-dot">●</span>
          </div>

          <div className="location arrival">
            <span className="time">
              {schedule?.arrivalTime
                ? moment(schedule.arrivalTime).format("hh:mm A")
                : "--:--"}
            </span>

            <strong>{schedule?.toCity || "Arrival"}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div className="seat-legend">
        <div>
          <span className="legend-icon available">●</span>
          Available
        </div>

        <div>
          <span className="legend-icon selected">●</span>
          Selected
        </div>

        <div>
          <span className="legend-icon booked">×</span>
          Booked
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="booking-layout">
        {/* =================================================
            BUS
        ================================================= */}

        <div className="bus-container">
          <div className="bus">
            {/* FRONT */}

            <div className="bus-front">
              <div className="windshield">
                <span>BUSGO</span>

                <small>DRIVER</small>
              </div>

              <div className="driver-seat">💺</div>
            </div>

            {/* BUS TITLE */}

            <div className="bus-title">
              <span>{schedule?.bus?.operatorName || "BUSGO"}</span>

              <small>{schedule?.bus?.busType || "AC BUS"}</small>
            </div>

            {/* SEAT AREA */}

            <div className="seat-area">
              {rows.map((row) => (
                <div className="seat-row" key={row}>
                  <Seat number={`${row}A`} />

                  <Seat number={`${row}B`} />

                  {/* AISLE */}

                  <div className="bus-aisle">
                    <span>{row}</span>
                  </div>

                  <Seat number={`${row}C`} />

                  <Seat number={`${row}D`} />
                </div>
              ))}
            </div>

            {/* REAR */}

            <div className="bus-rear">
              <span>REAR</span>
            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <aside className="booking-summary">
          <div className="summary-top">
            <div>
              <span>YOUR SELECTION</span>

              <h2>Booking Summary</h2>
            </div>

            <div className="seat-count">
              {selected.length}

              <small>/ 4</small>
            </div>
          </div>

          {/* ROUTE */}

          <div className="summary-route">
            <div>
              <strong>{schedule?.fromCity || "From"}</strong>

              <span>
                {schedule?.departureTime
                  ? moment(schedule.departureTime).format("hh:mm A")
                  : "--"}
              </span>
            </div>

            <div className="summary-arrow">→</div>

            <div className="summary-arrival">
              <strong>{schedule?.toCity || "To"}</strong>

              <span>
                {schedule?.arrivalTime
                  ? moment(schedule.arrivalTime).format("hh:mm A")
                  : "--"}
              </span>
            </div>
          </div>

          {/* DATE */}

          <div className="summary-date">
            📅
            <span>
              {schedule?.departureTime
                ? moment(schedule.departureTime).format("dddd, DD MMMM YYYY")
                : "Travel date"}
            </span>
          </div>

          {/* SELECTED SEATS */}

          <div className="selected-wrapper">
            <div className="summary-label">
              <span>Selected seats</span>

              <strong>{selected.length}</strong>
            </div>

            {selected.length === 0 ? (
              <div className="empty-selection">
                <div>💺</div>

                <strong>No seat selected</strong>

                <span>Click an available seat on the bus</span>
              </div>
            ) : (
              <div className="selected-list">
                {selected.map((seat) => (
                  <div className="selected-item" key={seat}>
                    <div className="mini-seat">💺</div>

                    <span>Seat {seat}</span>

                    <strong>₹{fare}</strong>

                    <button type="button" onClick={() => toggleSeat(seat)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRICE */}

          <div className="price-box">
            <div>
              <span>Seat fare</span>

              <strong>₹{fare}</strong>
            </div>

            <div>
              <span>Seats</span>

              <strong>× {selected.length}</strong>
            </div>

            <div className="total">
              <span>Total</span>

              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          {/* CTA */}

          <button
            className="confirm-btn"
            disabled={selected.length === 0 || booking}
            onClick={book}
          >
            {booking
              ? "Processing..."
              : selected.length === 0
                ? "Select a seat"
                : `Continue · ₹${total.toLocaleString("en-IN")} →`}
          </button>

          <p className="secure-note">🔒 Secure booking · Maximum 4 seats</p>
        </aside>
      </section>
    </main>
  );
}
