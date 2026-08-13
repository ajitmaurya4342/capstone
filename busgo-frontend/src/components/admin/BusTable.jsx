import { useMemo, useState } from "react";

export default function BusTable({ buses, onEdit }) {
  const [search, setSearch] = useState("");

  const filteredBuses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return buses;

    return buses.filter((bus) => {
      const searchableText = [
        bus.id,
        bus.busNumber,
        bus.operatorName,
        bus.busType,
        bus.totalSeats,
        "active",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [buses, search]);

  return (
    <div className="list-panel">
      <div className="list-header">
        <div>
          <h2>Bus Inventory</h2>

          <p className="list-description">
            Manage and search all registered buses
          </p>
        </div>

        <span className="count-pill">
          {filteredBuses.length}
          {filteredBuses.length !== buses.length && ` / ${buses.length}`} buses
        </span>
      </div>

      {/* SEARCH */}
      <div className="table-toolbar">
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bus number, operator, type, seats..."
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {search && (
          <span className="search-result">
            {filteredBuses.length} result
            {filteredBuses.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>BUS</th>
              <th>OPERATOR</th>
              <th>TYPE</th>
              <th>SEATS</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredBuses.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div>{search ? "⌕" : "🚌"}</div>

                  <strong>{search ? "No buses found" : "No buses yet"}</strong>

                  <span>
                    {search
                      ? `No bus matches "${search}". Try another search.`
                      : "Add your first bus above."}
                  </span>

                  {search && (
                    <button
                      className="empty-clear-button"
                      onClick={() => setSearch("")}
                    >
                      Clear Search
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredBuses.map((bus) => (
                <tr key={bus.id}>
                  <td>
                    <div className="bus-cell">
                      <div className="bus-avatar">🚌</div>

                      <div>
                        <strong>{bus.busNumber}</strong>

                        <small>ID #{bus.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>{bus.operatorName || "—"}</td>

                  <td>
                    <span className="type-badge">{bus.busType || "—"}</span>
                  </td>

                  <td>
                    <strong>{bus.totalSeats ?? "—"}</strong>
                  </td>

                  <td>
                    <span className="status-badge">
                      <i />
                      Active
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => onEdit(bus)}
                      title={`Edit ${bus.busNumber}`}
                    >
                      ✎
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
