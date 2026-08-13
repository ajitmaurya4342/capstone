export default function BusForm({
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
          <h2>{editing ? "Edit Bus" : "Add New Bus"}</h2>

          <p>
            {editing
              ? "Update bus information and operator details."
              : "Register a new bus in your BusGo application."}
          </p>
        </div>

        {editing && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <form className="pro-form" onSubmit={onSubmit}>
        <div className="input-group">
          <label>Bus Number</label>

          <input
            required
            value={form.busNumber}
            onChange={(e) => update("busNumber", e.target.value.toUpperCase())}
            placeholder="MH-09-AB-1234"
          />
        </div>

        <div className="input-group">
          <label>Operator Name</label>

          <input
            required
            value={form.operatorName}
            onChange={(e) => update("operatorName", e.target.value)}
            placeholder="Bus operator"
          />
        </div>

        <div className="input-group">
          <label>Bus Type</label>

          <select
            value={form.busType}
            onChange={(e) => update("busType", e.target.value)}
          >
            <option value="AC">AC</option>

            <option value="NON_AC">Non AC</option>

            <option value="SEATER">Seater</option>

            <option value="SLEEPER">Sleeper</option>
          </select>
        </div>

        <div className="input-group">
          <label>Total Seats</label>

          <input type="number" value={form.totalSeats} disabled />

          <small>Seat capacity is fixed by the bus configuration.</small>
        </div>

        <div className="form-footer">
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving..." : editing ? "Update Bus" : "+ Add Bus"}
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
