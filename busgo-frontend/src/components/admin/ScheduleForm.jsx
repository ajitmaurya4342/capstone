export default function ScheduleForm({
  buses,
  form,
  setForm,
  editing,
  saving,
  onSubmit,
  onCancel,
}) {
  const update = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <div className="form-panel">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">JOURNEY MANAGEMENT</span>

          <h2>{editing ? "Edit Schedule" : "Create Schedule"}</h2>

          <p>Configure route, timing and fare for a journey.</p>
        </div>

        {editing && (
          <button className="ghost-button" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>

      <form className="pro-form schedule-grid" onSubmit={onSubmit}>
        <div className="input-group full">
          <label>Select Bus</label>

          <select
            required
            value={form.busId}
            onChange={(e) => update("busId", e.target.value)}
          >
            <option value="">Select a bus</option>

            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.busNumber} — {bus.operatorName}
              </option>
            ))}
          </select>
        </div>

        <div className="route-fields">
          <div className="input-group">
            <label>From</label>

            <input
              required
              value={form.fromCity}
              onChange={(e) => update("fromCity", e.target.value)}
              placeholder="Kolhapur"
            />
          </div>

          <div className="route-arrow">→</div>

          <div className="input-group">
            <label>To</label>

            <input
              required
              value={form.toCity}
              onChange={(e) => update("toCity", e.target.value)}
              placeholder="Mumbai"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Journey Date</label>

          <input
            required
            type="date"
            value={form.journeyDate}
            onChange={(e) => update("journeyDate", e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Departure</label>

          <input
            required
            type="datetime-local"
            value={form.departureTime}
            onChange={(e) => update("departureTime", e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Arrival</label>

          <input
            required
            type="datetime-local"
            value={form.arrivalTime}
            onChange={(e) => update("arrivalTime", e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Fare</label>

          <div className="currency-input">
            <span>₹</span>

            <input
              required
              type="number"
              min="0"
              value={form.fare}
              onChange={(e) => update("fare", e.target.value)}
              placeholder="799"
            />
          </div>
        </div>

        <div className="form-footer full">
          <button
            type="submit"
            className="primary-button"
            disabled={saving || !buses.length}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Schedule"
                : "+ Create Schedule"}
          </button>

          {!editing && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
