import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Seats() {
  const { id } = useParams();
  const [booked, setBooked] = useState([]),
    [selected, setSelected] = useState([]);
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    api
      .get("/schedules/" + id + "/seats")
      .then((r) => setBooked(r.data))
      .catch(() => {});
  }, [id]);
  const toggle = (s) => {
    if (booked.includes(s)) return;
    setSelected((x) =>
      x.includes(s) ? x.filter((a) => a !== s) : x.length < 4 ? [...x, s] : x,
    );
  };
  const book = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await api.post("/bookings", { scheduleId: id, seatNumbers: selected });
      nav("/trips");
    } catch (e) {
      alert(e.response?.data?.message || "Booking failed");
    }
  };
  return (
    <main>
      <h2>Select Seats</h2>
      <div className="grid">
        {Array.from({ length: 40 }, (_, i) => {
          const s = `${Math.floor(i / 4) + 1}${"ABCD"[i % 4]}`;
          return (
            <button
              key={s}
              disabled={booked.includes(s)}
              className={selected.includes(s) ? "selected" : ""}
              onClick={() => toggle(s)}
            >
              {s}
            </button>
          );
        })}
      </div>
      <button disabled={!selected.length} onClick={book}>
        Confirm {selected.join(", ")}
      </button>
    </main>
  );
}
