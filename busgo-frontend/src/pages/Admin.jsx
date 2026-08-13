import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminTabs from "../components/admin/AdminTabs";
import BusManagement from "../components/admin/BusManagement";
import ScheduleManagement from "../components/admin/ScheduleManagement";

import "../components/admin/admin.css";

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

  const isAdmin = Boolean(user?.admin);

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
      setError(err.response?.data?.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const resetBus = () => {
    setBusForm(emptyBus);
    setEditingBusId(null);
  };

  const resetSchedule = () => {
    setScheduleForm(emptySchedule);
    setEditingScheduleId(null);
  };

  const handleEditBus = (bus) => {
    setTab("buses");

    setEditingBusId(bus.id);

    setBusForm({
      busNumber: bus.busNumber || "",
      operatorName: bus.operatorName || "",
      busType: bus.busType || "AC",
      totalSeats: bus.totalSeats ?? 40,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toDateTimeLocal = (value) => {
    if (!value) return "";

    return String(value).replace(" ", "T").slice(0, 16);
  };

  const handleEditSchedule = (schedule) => {
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      alert(err.response?.data?.message || "Could not save bus.");
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
      alert(err.response?.data?.message || "Could not save schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="access-denied">
          <div className="access-icon">🔒</div>

          <h2>Admin Access Required</h2>

          <p>Your account does not have administrator permissions.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <AdminHeader loading={loading} onRefresh={loadData} />

      {/* <AdminStats buses={buses} schedules={schedules} /> */}

      <AdminTabs
        activeTab={tab}
        setActiveTab={setTab}
        busCount={buses.length}
        scheduleCount={schedules.length}
      />

      {error && (
        <div className="admin-error">
          <span>⚠</span>
          {error}
        </div>
      )}

      {tab === "buses" ? (
        <BusManagement
          buses={buses}
          busForm={busForm}
          setBusForm={setBusForm}
          editingBusId={editingBusId}
          saving={saving}
          onSubmit={saveBus}
          onEdit={handleEditBus}
          onCancel={resetBus}
        />
      ) : (
        <ScheduleManagement
          buses={buses}
          schedules={schedules}
          scheduleForm={scheduleForm}
          setScheduleForm={setScheduleForm}
          editingScheduleId={editingScheduleId}
          saving={saving}
          onSubmit={saveSchedule}
          onEdit={handleEditSchedule}
          onCancel={resetSchedule}
        />
      )}
    </main>
  );
}
