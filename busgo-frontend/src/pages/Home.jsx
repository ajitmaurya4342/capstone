import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Home.css";
import ScheduleTab from "../components/ScheduleTab";

export default function Home() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noBusFound, setNoBusFound] = useState(false);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  /* =========================
     LOAD CITIES
  ========================= */

  useEffect(() => {
    const loadCities = async () => {
      try {
        setCitiesLoading(true);

        const response = await api.get("/schedules/cities");

        setCities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load cities", error);
      } finally {
        setCitiesLoading(false);
      }
    };

    loadCities();
  }, []);

  /* =========================
     FROM CITY CHANGE
  ========================= */

  const handleFromChange = (e) => {
    const from = e.target.value;

    setForm((prev) => ({
      ...prev,

      from,

      // Clear TO if it is the same city
      // as the newly selected FROM
      to: prev.to === from ? "" : prev.to,
    }));

    // Clear previous search results
    setResults([]);
    setNoBusFound(false);
  };

  /* =========================
     TO CITY CHANGE
  ========================= */

  const handleToChange = (e) => {
    const to = e.target.value;

    setForm((prev) => ({
      ...prev,
      to,
    }));

    setResults([]);
    setNoBusFound(false);
  };

  /* =========================
     DATE CHANGE
  ========================= */

  const handleDateChange = (e) => {
    setForm((prev) => ({
      ...prev,
      date: e.target.value,
    }));

    setResults([]);
    setNoBusFound(false);
  };

  /* =========================
     SEARCH
  ========================= */

  const search = async (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.date) {
      return;
    }

    if (form.from === form.to) {
      alert("From and To cities cannot be the same.");
      return;
    }

    try {
      setLoading(true);
      setNoBusFound(false);

      const response = await api.get("/schedules/search", {
        params: form,
      });

      setResults(Array.isArray(response.data) ? response.data : []);

      if (!response.data || response.data.length === 0) {
        setNoBusFound(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SWAP CITIES
  ========================= */

  const swapCities = () => {
    if (!form.from && !form.to) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));

    setResults([]);
    setNoBusFound(false);
  };

  /* =========================
     TO CITY OPTIONS
     Remove selected FROM
  ========================= */

  const toCities = cities.filter((city) => city !== form.from);

  /* =========================
     TODAY
  ========================= */

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="busgo-page">
      {/* =========================
          HERO
      ========================= */}

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

          {/* =========================
              SEARCH CARD
          ========================= */}

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
                {/* =====================
                    FROM
                ===================== */}

                <div className="field-group">
                  <label>FROM</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>

                    <select
                      value={form.from}
                      onChange={handleFromChange}
                      disabled={citiesLoading}
                    >
                      <option value="">
                        {citiesLoading
                          ? "Loading cities..."
                          : "Select departure city"}
                      </option>

                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* =====================
                    SWAP
                ===================== */}

                <button
                  type="button"
                  className="swap-btn"
                  onClick={swapCities}
                  disabled={!form.from && !form.to}
                  title="Swap cities"
                >
                  ⇄
                </button>

                {/* =====================
                    TO
                ===================== */}

                <div className="field-group">
                  <label>TO</label>

                  <div
                    className={`input-wrapper ${
                      !form.from ? "input-disabled" : ""
                    }`}
                  >
                    <span className="input-icon">📍</span>

                    <select
                      value={form.to}
                      onChange={handleToChange}
                      disabled={!form.from}
                    >
                      <option value="">
                        {!form.from
                          ? "Select From city first"
                          : "Select arrival city"}
                      </option>

                      {toCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* =====================
                    DATE
                ===================== */}

                <div className="field-group date-field">
                  <label>TRAVEL DATE</label>

                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>

                    <input
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>

                {/* =====================
                    SEARCH BUTTON
                ===================== */}

                <button
                  type="submit"
                  className="search-btn"
                  disabled={loading || !form.from || !form.to || !form.date}
                >
                  {loading ? "Searching..." : "Search Buses →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================
          SEARCH RESULTS
      ========================= */}

      {results.length > 0 && (
        <ScheduleTab
          results={results}
          from={form.from}
          to={form.to}
          onSelectSeats={(id) => nav(`/seats/${id}`)}
        />
      )}

      {/* =========================
          NO RESULTS
      ========================= */}

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

      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">
        <div>
          <span>YOUR JOURNEY STARTS HERE</span>

          <h2>Ready to hit the road?</h2>

          <p>Find your perfect bus and book your seat today.</p>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              🚌 Bus<span>Go</span>
            </div>

            <p className="footer-description">
              BusGo is a modern bus booking platform designed to make travel
              easier from booking to boarding. We connect travelers with
              reliable bus operators, convenient routes, flexible schedules, and
              transparent fares—all through a simple and user-friendly
              experience. Whether you're planning a daily journey, a weekend
              trip, or a long-distance adventure, BusGo helps you discover the
              right bus, choose your preferred seat, and book your journey with
              confidence.
            </p>
          </div>
        </div>

        <div className="footer-bottom">© 2026 BusGo. All rights reserved.</div>
      </footer>
    </div>
  );
}
