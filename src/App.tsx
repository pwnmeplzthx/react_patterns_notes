import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import styles from "./App.module.css";
import { TracksActions } from "./components/tracks-actions";
import { TracksCell } from "./components/tracks-cell";
import { TracksTaskRow } from "./components/tracks-task-row";
import { TableTrack } from "./components/table-track";
import { TracksSummaryRow } from "./components/tracks-summary-row";
import { TracksDayHeadCell } from "./components/tracks-day-head-cell";
import { TracksTable } from "./components/tracks-table";

export interface Track {
  id: string;
  name: string;
  task: string;
  hours: number;
  date: string;
}

const App = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hideWeekends, setHideWeekends] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    day: number;
    task: string;
  } | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    task: "",
    hours: 0,
    date: new Date().toISOString().split("T")[0]
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const currentDayRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    fetchTracks();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedCell) {
      setFormData(prev => ({
        ...prev,
        task: selectedCell.task,
        date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedCell.day).padStart(2, "0")}`
      }));
    } else {
      setFormData({
        name: "",
        task: "",
        hours: 0,
        date: new Date().toISOString().split("T")[0]
      });
    }
  }, [selectedCell, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchTracks();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const today = new Date();
    if (
      today.getMonth() === selectedMonth &&
      today.getFullYear() === selectedYear &&
      currentDayRef.current &&
      tableContainerRef.current
    ) {
      const container = tableContainerRef.current;
      const cell = currentDayRef.current;
      const containerWidth = container.offsetWidth;
      const cellLeft = cell.offsetLeft;
      const cellWidth = cell.offsetWidth;

      // Center the current day in the container
      container.scrollLeft = cellLeft - containerWidth / 2 + cellWidth / 2;
    }
  }, [selectedMonth, selectedYear, hideWeekends]);

  const fetchTracks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tracks");
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const getUniqueTasks = () => {
    const monthTracks = tracks.filter(track => {
      const trackDate = new Date(track.date);
      return (
        trackDate.getMonth() === selectedMonth &&
        trackDate.getFullYear() === selectedYear
      );
    });
    return [...new Set(monthTracks.map(track => track.task))];
  };

  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  };

  const getVisibleDays = () => {
    const days = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);
    return hideWeekends ? days.filter(day => !isWeekend(day)) : days;
  };

  const isWeekend = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getDayTracks = (day: number, task: string) => {
    return tracks.filter(track => {
      const trackDate = new Date(track.date);
      return (
        trackDate.getDate() === day &&
        trackDate.getMonth() === selectedMonth &&
        trackDate.getFullYear() === selectedYear &&
        track.task === task
      );
    });
  };

  const getDayTotal = (day: number) => {
    return tracks
      .filter(track => {
        const trackDate = new Date(track.date);
        return (
          trackDate.getDate() === day &&
          trackDate.getMonth() === selectedMonth &&
          trackDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, track) => sum + track.hours, 0);
  };

  const getTaskTotal = (task: string) => {
    return tracks
      .filter(track => {
        const trackDate = new Date(track.date);
        return (
          trackDate.getMonth() === selectedMonth &&
          trackDate.getFullYear() === selectedYear &&
          track.task === task
        );
      })
      .reduce((sum, track) => sum + track.hours, 0);
  };

  const getMonthTotal = () => {
    return tracks
      .filter(track => {
        const trackDate = new Date(track.date);
        return (
          trackDate.getMonth() === selectedMonth &&
          trackDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, track) => sum + track.hours, 0);
  };

  const handleCellClick = (day: number, task: string) => {
    setSelectedCell({ day, task });
    setIsModalOpen(true);
  };

  const handleUpdateTrack = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    setSelectedTrack(track);
    setFormData({
      name: track.name,
      task: track.task,
      hours: track.hours,
      date: track.date
    });
    setIsModalOpen(true);
  };

  const handleDeleteTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this track?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/tracks/${trackId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        fetchTracks();
      } else {
        console.error("Failed to delete track:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting track:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedTrack ? "PUT" : "POST";
      const url = selectedTrack
        ? `http://localhost:3000/tracks/${selectedTrack.id}`
        : "http://localhost:3000/tracks";

      const body = {
        ...formData,
        id: selectedTrack?.id || nanoid()
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchTracks();
        setIsModalOpen(false);
        setSelectedTrack(null);
        setFormData({
          name: "",
          task: "",
          hours: 0,
          date: new Date().toISOString().split("T")[0]
        });
      } else {
        console.error("Failed to save track:", await response.text());
      }
    } catch (error) {
      console.error("Error saving track:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "hours" ? parseFloat(value) || 0 : value
    }));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const getWeekday = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
          Add Track
        </button>
        <select
          className={styles.select}
          value={selectedMonth}
          onChange={e => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={selectedYear}
          onChange={e => setSelectedYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i).map(
            year => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="hideWeekends"
            className={styles.checkbox}
            checked={hideWeekends}
            onChange={e => setHideWeekends(e.target.checked)}
          />
          <label htmlFor="hideWeekends" className={styles.checkboxLabel}>
            Hide Weekends
          </label>
        </div>
      </div>

      <TracksTable
        tableContainerRef={tableContainerRef}
        days={getVisibleDays().map(day => (
          <TracksDayHeadCell
            key={day}
            day={day}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            currentDayRef={currentDayRef}
            getWeekday={getWeekday}
          />
        ))}
      >
        {getUniqueTasks().map((task, index) => (
          <TracksTaskRow
            getTaskTotal={getTaskTotal}
            task={task}
            key={index}
            days={getVisibleDays().map((day, index) => (
              <TracksCell
                day={day}
                task={task}
                key={index}
                getDayTracks={getDayTracks}
                handleCellClick={handleCellClick}
                tracks={getDayTracks(day, task).map(track => (
                  <TableTrack
                    key={track.id}
                    track={track}
                    actions={
                      <TracksActions
                        track={track}
                        handleUpdateTrack={handleUpdateTrack}
                        handleDeleteTrack={handleDeleteTrack}
                      />
                    }
                  />
                ))}
              />
            ))}
          />
        ))}
        <TracksSummaryRow
          getMonthTotal={getMonthTotal}
          getVisibleDays={getVisibleDays}
          getDayTotal={getDayTotal}
        />
      </TracksTable>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setIsModalOpen(false);
            setSelectedTrack(null);
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
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedTrack(null);
                  }}
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
