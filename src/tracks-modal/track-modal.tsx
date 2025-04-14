import { useTrackModalContext } from "./components/track-modal-context";
import { TrackModalView } from "./components/track-modal";
import { Track } from "../App";
import { useTrackForm } from "./hooks/use-track-form";
import { TrackForm } from "./components/track-form";

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
  const context = useTrackModalContext();

  const { close, isOpenModal, selectedCell, selectedTrack } = context;

  const { formData, handleInputChange, handleSubmit, isEdit } = useTrackForm({
    selectedMonth,
    selectedYear,
    selectedCell,
    selectedTrack,
    trackCreate,
    trackUpdate
  });

  if (!isOpenModal) return null;
  return (
    <TrackModalView isEdit={isEdit} onClose={close}>
      <TrackForm
        formData={formData}
        isEdit={isEdit}
        onCancel={close}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </TrackModalView>
  );
}
