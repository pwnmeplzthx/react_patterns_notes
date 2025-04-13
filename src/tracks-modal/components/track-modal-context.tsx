import { createContext } from "react";
import { useTrackModal } from "../hooks/use-track-modal";

type TrackModalContext = ReturnType<typeof useTrackModal>;

export const trackModalContext = createContext<TrackModalContext | null>(null);

export function TrackModalProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const trackModal = useTrackModal();

  return (
    <trackModalContext.Provider value={trackModal}>
      {children}
    </trackModalContext.Provider>
  );
}
