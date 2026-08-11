import { useEffect, useState } from "react";
import api from "../services/api";

export default function Trips() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");

    api
      .get("/bookings/mine")
      .then((response) => {
        setItems(response.data);
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

  const cancel = (id) => {
    api
      .put("/bookings/" + id + "/cancel")
      .then(() => {
        load();
      })
      .catch((error) => {
        console.error("Failed to cancel booking:", error);

        alert(error.response?.data?.message || "Failed to cancel booking.");
      });
  };

  if (loading) {
    return (
      <main>
        <h2>My Trips</h2>
        <p>Loading your trips...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h2>My Trips</h2>
        <p>{error}</p>
        <button onClick={load}>Retry</button>
      </main>
    );
  }

  return (
    <main>
      <h2>My Trips</h2>

      {items.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        items.map((booking) => (
          <article key={booking.id}>
            <h3>
              {booking.schedule.fromCity} → {booking.schedule.toCity}
            </h3>

            <div>
              <strong>Bus:</strong> {booking.schedule.bus.busNumber}
            </div>

            <div>
              <strong>Operator:</strong> {booking.schedule.bus.operatorName}
            </div>

            <div>
              <strong>Journey Date:</strong> {booking.schedule.journeyDate}
            </div>

            <div>
              <strong>Departure:</strong> {booking.schedule.departureTime}
            </div>

            <div>
              <strong>Arrival:</strong> {booking.schedule.arrivalTime}
            </div>

            <div>
              <strong>Seats:</strong>{" "}
              {booking.seatNumbers?.length
                ? booking.seatNumbers.join(", ")
                : "No seats"}
            </div>

            <div>
              <strong>Fare:</strong> ₹{booking.schedule.fare}
            </div>

            <div>
              <strong>Total:</strong> ₹{booking.totalFare}
            </div>

            <div>
              <strong>Status:</strong> {booking.status}
            </div>

            <div>
              <strong>Booked On:</strong>{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </div>

            {booking.status === "CONFIRMED" && (
              <button onClick={() => cancel(booking.id)}>Cancel</button>
            )}
          </article>
        ))
      )}
    </main>
  );
}
