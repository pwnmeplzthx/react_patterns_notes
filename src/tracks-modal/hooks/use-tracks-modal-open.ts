import { useTrackModalContext } from "../components/track-modal-context";

export function useTracksModalOpen() {
  const context = useTrackModalContext();

  return {
    cellClick: context.cellClick,
    trackClick: context.trackClick,
    createClick: context.createClick
  };
}
