import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";
import moment from "moment";

export default function Home() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    from: "Hyderabad",
    to: "Bangalore",
    date: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noBusFound, setNoBusFound] = useState(false);

  const search = async (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.date) {
      alert("Please select From, To and Date");
      return;
    }

    try {
      setLoading(true);

      const r = await api.get("/schedules/search", {
        params: form,
      });

      console.log({ r });

      setResults(r.data);
      if (r.data.length == 0) {
        setNoBusFound(true);
      }
    } catch (e) {
      alert(e.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setForm({
      ...form,
      from: form.to,
      to: form.from,
    });
  };

  return (
    <div className="busgo-page">
      {/* NAVBAR */}

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              ✨ India's smarter bus booking experience
            </span>

            <h1>
              Travel anywhere.
              <br />
              <span>Book your bus.</span>
            </h1>

            <p>
              Discover comfortable buses, compare fares and reserve your seats
              in just a few clicks.
            </p>
          </div>

          {/* SEARCH CARD */}
          <div className="search-card" id="search">
            <div className="search-header">
              <div>
                <h2>Find your bus</h2>
                <p>Search buses for your next journey</p>
              </div>

              <span className="round-trip">● One Way</span>
            </div>

            <form onSubmit={search}>
              <div className="search-fields">
                {/* FROM */}
                <div className="field-group">
                  <label>FROM</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>

                    <input
                      placeholder="Departure city"
                      value={form.from}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          from: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* SWAP */}
                <button
                  type="button"
                  className="swap-btn"
                  onClick={swapCities}
                  title="Swap cities"
                >
                  ⇄
                </button>

                {/* TO */}
                <div className="field-group">
                  <label>TO</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>

                    <input
                      placeholder="Arrival city"
                      value={form.to}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          to: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* DATE */}
                <div className="field-group date-field">
                  <label>TRAVEL DATE</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>

                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? "Searching..." : "Search Buses →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      {/* SEARCH RESULTS */}
      {results.length > 0 && (
        <section className="results-section">
          <div className="section-container">
            <div className="results-title">
              <div>
                <span className="section-label">AVAILABLE BUSES</span>

                <h2>
                  {form.from} → {form.to}
                </h2>

                <p>{results.length} buses available for your journey</p>
              </div>

              {/* <button className="filter-btn">⚙ Filters</button> */}
            </div>

            <div className="bus-list">
              {results.map((s) => (
                <article className="bus-card" key={s.id}>
                  {/* OPERATOR */}
                  <div className="bus-company">
                    <div className="bus-logo">🚌</div>

                    <div>
                      <h3>{s.bus?.operatorName || "Bus Operator"}</h3>

                      <span className="bus-type">
                        {s.bus?.busType || "SEATER"}
                      </span>
                    </div>
                  </div>

                  {/* JOURNEY */}
                  <div className="journey-time">
                    {/* DEPARTURE */}
                    <div className="time-block">
                      <strong>
                        {s?.departureTime
                          ? moment(s.departureTime).format("ddd, DD MMM YYYY")
                          : "--"}
                      </strong>

                      <strong>
                        {s?.departureTime
                          ? moment(s.departureTime).format("hh:mm A")
                          : "--"}
                      </strong>

                      <span>{s.fromCity}</span>
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
                        {s?.arrivalTime
                          ? moment(s.arrivalTime).format("ddd, DD MMM YYYY")
                          : "--"}
                      </strong>

                      <strong>
                        {s?.arrivalTime
                          ? moment(s.arrivalTime).format("hh:mm A")
                          : "--"}
                      </strong>

                      <span>{s.toCity}</span>
                    </div>
                  </div>

                  {/* PRICE + SELECT SEATS */}
                  <div className="bus-action">
                    <div className="bus-price">
                      <span className="starting">Price :</span>

                      <strong>
                        ₹{s.fare} <span className="per-seat">per seat</span>
                      </strong>
                    </div>

                    <button
                      className="seat-btn"
                      onClick={() => nav(`/seats/${s.id}`)}
                    >
                      Select Seats
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NO RESULTS */}
      {!loading && form.date && results.length === 0 && noBusFound && (
        <section className="no-results">
          <div className="empty-icon">🚌</div>

          <h2>No buses found</h2>

          <p>
            We couldn't find buses for this route and date. Try another date or
            destination.
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div>
          <span>YOUR JOURNEY STARTS HERE</span>

          <h2>Ready to hit the road?</h2>

          <p>Find your perfect bus and book your seat today.</p>
        </div>

        {/* <button
          onClick={() =>
            document
              .getElementById("search")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Search Buses →
        </button> */}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              🚌 Bus<span>Go</span>
            </div>

            <p>Making bus travel simple, comfortable and accessible.</p>
          </div>
        </div>

        <div className="footer-bottom">© 2026 BusGo. All rights reserved.</div>
      </footer>
    </div>
  );
}
