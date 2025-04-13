import { useContext } from "react";
import { useTrackForm } from "../hooks/use-track-form";
import { trackModalContext } from "./track-modal-context";
import { Track } from "../../App";

import styles from "./track-modal.module.css";

export function TrackModal({
  trackCreate,
  trackUpdate,
  selectedMonth,
  selectedYear
}: {
  trackCreate: (track: Omit<Track, "id">) => void;
  trackUpdate: (track: Track) => void;
  selectedMonth: number;
  selectedYear: number;
}) {
  const context = useContext(trackModalContext);
  if (!context)
    throw new Error(
      "useTracksModalOpen must be used within TrackModalProvider"
    );

  const { close, isOpenModal, selectedCell, selectedTrack } = context;

  const { formData, handleInputChange, handleSubmit } = useTrackForm({
    selectedMonth,
    selectedYear,
    selectedCell,
    selectedTrack,
    trackCreate,
    trackUpdate
  });

  if (!isOpenModal) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => {
        close();
      }}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{selectedTrack ? "Edit Track" : "Add Track"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              {selectedTrack ? "Update" : "Add"} Track
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => close()}
              style={{ backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
