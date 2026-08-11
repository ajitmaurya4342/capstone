import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyBus = {
  busNumber: "",
  operatorName: "",
  busType: "AC",
  totalSeats: 40,
};

const emptySchedule = {
  busId: "",
  fromCity: "",
  toCity: "",
  journeyDate: "",
  departureTime: "",
  arrivalTime: "",
  fare: "",
};

const getRole = (user) =>
  String(
    user?.role || user?.user?.role || user?.authorities?.[0]?.authority || "",
  ).toUpperCase();

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("buses");
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busForm, setBusForm] = useState(emptyBus);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [editingBusId, setEditingBusId] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [saving, setSaving] = useState(false);

  console.log(user);

  const isAdmin = useMemo(() => user?.admin, [user]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [busResponse, scheduleResponse] = await Promise.all([
        api.get("/buses"),
        api.get("/schedules"),
      ]);
      setBuses(Array.isArray(busResponse.data) ? busResponse.data : []);
      setSchedules(
        Array.isArray(scheduleResponse.data) ? scheduleResponse.data : [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load admin data. Make sure the bus and schedule API endpoints are available.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const resetBus = () => {
    setBusForm(emptyBus);
    setEditingBusId(null);
  };

  const resetSchedule = () => {
    setScheduleForm(emptySchedule);
    setEditingScheduleId(null);
  };

  const editBus = (bus) => {
    setTab("buses");
    setEditingBusId(bus.id);
    setBusForm({
      busNumber: bus.busNumber || "",
      operatorName: bus.operatorName || "",
      busType: bus.busType || "AC",
      totalSeats: bus.totalSeats ?? 40,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toDateTimeLocal = (value) => {
    if (!value) return "";
    return String(value).replace(" ", "T").slice(0, 16);
  };

  const editSchedule = (schedule) => {
    setTab("schedules");
    setEditingScheduleId(schedule.id);
    setScheduleForm({
      busId: schedule.bus?.id || schedule.busId || "",
      fromCity: schedule.fromCity || "",
      toCity: schedule.toCity || "",
      journeyDate: schedule.journeyDate || "",
      departureTime: toDateTimeLocal(schedule.departureTime),
      arrivalTime: toDateTimeLocal(schedule.arrivalTime),
      fare: schedule.fare ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveBus = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...busForm,
        totalSeats: Number(busForm.totalSeats),
      };

      if (editingBusId) {
        await api.put(`/buses/${editingBusId}`, payload);
      } else {
        await api.post("/buses", payload);
      }

      resetBus();
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not save bus details.");
    } finally {
      setSaving(false);
    }
  };

  const saveSchedule = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        busId: scheduleForm.busId,
        fromCity: scheduleForm.fromCity,
        toCity: scheduleForm.toCity,
        journeyDate: scheduleForm.journeyDate,
        departureTime: scheduleForm.departureTime,
        arrivalTime: scheduleForm.arrivalTime,
        fare: Number(scheduleForm.fare),
      };

      if (editingScheduleId) {
        await api.put(`/schedules/${editingScheduleId}`, payload);
      } else {
        await api.post("/schedules", payload);
      }

      resetSchedule();
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not save schedule details.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="admin-card">
          <h2>Admin access required</h2>
          <p>
            You are logged in, but this account does not have the ADMIN role.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">BUSGO MANAGEMENT</p>
          <h1>Admin Panel</h1>
          <p>Manage buses and journey schedules from one place.</p>
        </div>
        <button
          className="secondary-button"
          onClick={loadData}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={tab === "buses" ? "active" : ""}
          onClick={() => setTab("buses")}
        >
          Buses <span>{buses.length}</span>
        </button>
        <button
          className={tab === "schedules" ? "active" : ""}
          onClick={() => setTab("schedules")}
        >
          Schedules <span>{schedules.length}</span>
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {tab === "buses" ? (
        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>{editingBusId ? "Edit Bus" : "Add Bus"}</h2>
              <p>
                {editingBusId
                  ? "Update the selected bus details."
                  : "Add a new bus to BusGo."}
              </p>
            </div>
            {editingBusId && (
              <button className="secondary-button" onClick={resetBus}>
                Cancel edit
              </button>
            )}
          </div>

          <form className="admin-form" onSubmit={saveBus}>
            <label>
              Bus Number
              <input
                required
                value={busForm.busNumber}
                onChange={(e) =>
                  setBusForm({ ...busForm, busNumber: e.target.value })
                }
                placeholder="KA-01-AB-1234"
              />
            </label>
            <label>
              Operator Name
              <input
                required
                value={busForm.operatorName}
                onChange={(e) =>
                  setBusForm({ ...busForm, operatorName: e.target.value })
                }
                placeholder="Bus operator"
              />
            </label>
            <label>
              Bus Type
              <select
                value={busForm.busType}
                onChange={(e) =>
                  setBusForm({ ...busForm, busType: e.target.value })
                }
              >
                <option>SLEEPER</option>
                <option>SEATER</option>
              </select>
            </label>
            <label>
              Total Seats
              <input
                required
                type="number"
                min="1"
                value={busForm.totalSeats}
                onChange={(e) =>
                  setBusForm({ ...busForm, totalSeats: e.target.value })
                }
                disabled={true}
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingBusId ? "Update Bus" : "Add Bus"}
              </button>
              {!editingBusId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetBus}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="section-heading list-heading">
            <div>
              <h2>Bus List</h2>
              <p>
                {buses.length} bus{buses.length === 1 ? "" : "es"} available
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Operator</th>
                  <th>Type</th>
                  <th>Seats</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {buses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No buses found.
                    </td>
                  </tr>
                ) : (
                  buses.map((bus) => (
                    <tr key={bus.id}>
                      <td>
                        <strong>{bus.busNumber}</strong>
                      </td>
                      <td>{bus.operatorName}</td>
                      <td>{bus.busType || "—"}</td>
                      <td>{bus.totalSeats ?? "—"}</td>
                      <td>
                        <button
                          className="table-button"
                          onClick={() => editBus(bus)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>{editingScheduleId ? "Edit Schedule" : "Add Schedule"}</h2>
              <p>
                {editingScheduleId
                  ? "Update the selected journey."
                  : "Create a journey for one of your buses."}
              </p>
            </div>
            {editingScheduleId && (
              <button className="secondary-button" onClick={resetSchedule}>
                Cancel edit
              </button>
            )}
          </div>

          <form className="admin-form schedule-form" onSubmit={saveSchedule}>
            <label>
              Bus
              <select
                required
                value={scheduleForm.busId}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, busId: e.target.value })
                }
              >
                <option value="">Select bus</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busNumber} — {bus.operatorName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              From
              <input
                required
                value={scheduleForm.fromCity}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, fromCity: e.target.value })
                }
                placeholder="Hyderabad"
              />
            </label>
            <label>
              To
              <input
                required
                value={scheduleForm.toCity}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, toCity: e.target.value })
                }
                placeholder="Bangalore"
              />
            </label>
            <label>
              Journey Date
              <input
                required
                type="date"
                value={scheduleForm.journeyDate}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    journeyDate: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Departure
              <input
                required
                type="datetime-local"
                value={scheduleForm.departureTime}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    departureTime: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Arrival
              <input
                required
                type="datetime-local"
                value={scheduleForm.arrivalTime}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    arrivalTime: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Fare (₹)
              <input
                required
                type="number"
                min="0"
                value={scheduleForm.fare}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, fare: e.target.value })
                }
                placeholder="799"
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={saving || !buses.length}>
                {saving
                  ? "Saving..."
                  : editingScheduleId
                    ? "Update Schedule"
                    : "Add Schedule"}
              </button>
              {!editingScheduleId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetSchedule}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="section-heading list-heading">
            <div>
              <h2>Schedule List</h2>
              <p>
                {schedules.length} schedule{schedules.length === 1 ? "" : "s"}{" "}
                available
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bus</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Fare</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No schedules found.
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>
                        <strong>
                          {schedule.fromCity} → {schedule.toCity}
                        </strong>
                      </td>
                      <td>
                        {schedule.bus?.busNumber || schedule.busId || "—"}
                      </td>
                      <td>{schedule.journeyDate}</td>
                      <td>
                        {schedule.departureTime} → {schedule.arrivalTime}
                      </td>
                      <td>₹{schedule.fare}</td>
                      <td>
                        <button
                          className="table-button"
                          onClick={() => editSchedule(schedule)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
