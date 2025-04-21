import { Header } from "./header";
import { Outlet } from "react-router-dom";

import styles from "./layout.module.css";
import {
  AddTrackModal,
  AddTrackToCellModal,
  UpdateTrackModal
} from "@/modules/tracks-modal";

import { useTracks } from "@/modules/tracks-table";
export const Layout = () => {
  const tracks = useTracks({ shouldFetch: false });
  return (
    <div>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <AddTrackModal trackCreate={tracks.trackCreate} />
      <UpdateTrackModal trackUpdate={tracks.trackUpdate} />
      <AddTrackToCellModal trackCreate={tracks.trackCreate} />
    </div>
  );
};
