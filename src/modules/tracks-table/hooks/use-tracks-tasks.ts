import { useMemo } from "react";
import { Track } from "./use-tracks";

export function useTracksTasks({ tracks }: { tracks: Track[] }) {
  const uniqueTasks = useMemo(
    () => Array.from(new Set(tracks.map(track => track.task))),
    [tracks]
  );

  return {
    uniqueTasks
  };
}
