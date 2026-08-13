import ScheduleForm from "./ScheduleForm";
import ScheduleTable from "./ScheduleTable";

export default function ScheduleManagement({
  buses,
  schedules,
  scheduleForm,
  setScheduleForm,
  editingScheduleId,
  saving,
  onSubmit,
  onEdit,
  onCancel,
}) {
  return (
    <section className="management-card">
      <ScheduleForm
        buses={buses}
        form={scheduleForm}
        setForm={setScheduleForm}
        editing={editingScheduleId}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      <ScheduleTable schedules={schedules} onEdit={onEdit} />
    </section>
  );
}
