import React from "react";
import { Track } from "./use-tracks";

export interface TrackApi {
  fetchTracks: () => Promise<Track[]>;
  deleteTrack: (trackId: string) => Promise<void>;
  updateTrack: (track: Track) => Promise<void>;
  createTrack: (track: Omit<Track, "id">) => Promise<void>;
}

export const tracksApiContext = React.createContext<TrackApi | null>(null);

export function useTracksApi() {
  const api = React.useContext(tracksApiContext);
  console.log("api", api);

  if (!api) {
    throw new Error("useTracksApi must be used within a TracksApiProvider");
  }

  return api;
}

export function TracksApiProvider({
  children,
  value
}: {
  children: React.ReactNode;
  value: TrackApi;
}) {
  return (
    <tracksApiContext.Provider value={value}>
      {children}
    </tracksApiContext.Provider>
  );
}
