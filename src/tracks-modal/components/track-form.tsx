import { Track } from "../../App";
import styles from "./track-form.module.css";

export function TrackForm({
  formData,
  onInputChange,
  isEdit,
  onSubmit,
  additionalActions,
  onCancel
}: {
  formData: Omit<Track, "id">;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  additionalActions?: React.ReactNode;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="task">Task:</label>
        <input
          type="text"
          id="task"
          name="task"
          value={formData.task}
          onChange={onInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="hours">Hours:</label>
        <input
          type="number"
          id="hours"
          name="hours"
          value={formData.hours}
          onChange={onInputChange}
          min="0"
          step="0.5"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={onInputChange}
          required
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>
          {isEdit ? "Update" : "Add"} Track
        </button>
        {additionalActions}
        <button
          type="button"
          className={styles.button}
          onClick={() => onCancel()}
          style={{ backgroundColor: "#6c757d" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
