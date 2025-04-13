import styles from "./App.module.css";
import { TracksActions } from "./components/tracks-actions";
import { TracksCell } from "./components/tracks-cell";
import { TracksTaskRow } from "./components/tracks-task-row";
import { TableTrack } from "./components/table-track";
import { TracksSummaryRow } from "./components/tracks-summary-row";
import { TracksDayHeadCell } from "./components/tracks-day-head-cell";
import { TracksTable } from "./components/tracks-table";
import { useTracks } from "./hooks/use-tracks";
import { useTracksFilter } from "./hooks/use-tracks-filter";
import { TracksFilters } from "./components/tracks-filters";
import { useTasks } from "./hooks/use-tasks";
import { useTableComputing } from "./hooks/use-table-comuting";
import { TrackModal } from "./tracks-modal/components/track-modal";
import { useTracksModalOpen } from "./tracks-modal/hooks/use-tracks-modal-open";
import { TrackModalProvider } from "./tracks-modal/components/track-modal-context";

export interface Track {
  id: string;
  name: string;
  task: string;
  hours: number;
  date: string;
}

const AppContent = () => {
  const { trackCreate, trackDelete, trackUpdate, tracks } = useTracks();
  const { filteredTracks, filters, setFilters, visibleDays } = useTracksFilter({
    tracks
  });

  const { uniqueTasks } = useTasks({
    tracks: filteredTracks
  });

  const { getDayTotal, getDayTracks, getTaskTotal, getTotal } =
    useTableComputing({ tracks: filteredTracks });

  const { cellClick, createClick, trackClick } = useTracksModalOpen();

  return (
    <div className={styles.container}>
      <TracksFilters
        {...filters}
        {...setFilters}
        actions={
          <button className={styles.button} onClick={() => createClick()}>
            Add Track
          </button>
        }
      />

      <TracksTable
        tasks={uniqueTasks}
        renderDays={currentDayRef =>
          visibleDays.map(day => (
            <TracksDayHeadCell
              key={day}
              day={day}
              {...filters}
              currentDayRef={currentDayRef}
            />
          ))
        }
        renderTask={task => (
          <TracksTaskRow
            key={task}
            getTaskTotal={getTaskTotal}
            task={task}
            days={visibleDays.map(day => (
              <TracksCell
                key={`${day}-${task}`}
                day={day}
                task={task}
                getDayTracks={getDayTracks}
                onCellClick={cellClick}
                tracks={getDayTracks(day, task).map(track => (
                  <TableTrack
                    key={track.id}
                    track={track}
                    actions={
                      <TracksActions
                        track={track}
                        onUpdateTrack={trackClick}
                        onDeleteTrack={trackDelete}
                      />
                    }
                  />
                ))}
              />
            ))}
          />
        )}
        summary={
          <TracksSummaryRow
            getMonthTotal={getTotal}
            visibleDays={visibleDays}
            getDayTotal={getDayTotal}
          />
        }
      />
      <TrackModal
        selectedMonth={filters.selectedMonth}
        selectedYear={filters.selectedYear}
        trackCreate={trackCreate}
        trackUpdate={trackUpdate}
      />
    </div>
  );
};

export default function App() {
  return (
    <TrackModalProvider>
      <AppContent />
    </TrackModalProvider>
  );
}
