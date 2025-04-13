import { useContext } from "react";
import { trackModalContext } from "../components/track-modal-context";

export function useTracksModalOpen() {
  const context = useContext(trackModalContext);
  if (!context)
    throw new Error(
      "useTracksModalOpen must be used within TrackModalProvider"
    );

  return {
    cellClick: context.cellClick,
    trackClick: context.trackClick,
    createClick: context.createClick
  };
}
