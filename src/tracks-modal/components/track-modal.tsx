import styles from "./track-modal.module.css";

export function TrackModalView({
  isEdit,
  onClose,
  children
}: {
  isEdit: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={styles.modalOverlay}
      onClick={() => {
        onClose();
      }}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Track" : "Add Track"}</h2>
        {children}
      </div>
    </div>
  );
}
