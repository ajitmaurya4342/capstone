import BusForm from "./BusForm";
import BusTable from "./BusTable";

export default function BusManagement({
  buses,
  busForm,
  setBusForm,
  editingBusId,
  saving,
  onSubmit,
  onEdit,
  onCancel,
}) {
  return (
    <section className="management-card">
      <BusForm
        form={busForm}
        setForm={setBusForm}
        editing={editingBusId}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      <BusTable buses={buses} onEdit={onEdit} />
    </section>
  );
}
