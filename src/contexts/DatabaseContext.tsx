import { createContext, useContext, useEffect, useState } from "react";
import { createRxDatabase, RxDatabase } from "rxdb";
import { addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { CineEntrySchema } from "../models/CineEntry.schema";
import { CineEntrySeasonEpisodesSchema } from "../models/CineEntrySeasonEpisodes.schema";
import { CineEntrySeasonsSchema } from "../models/CineEntrySeasons.schema";

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);

const DatabaseContext = createContext<RxDatabase | null>(null);

// DatabaseProvider component to initialize and provide the database
export const DatabaseProvider = ({ children }: any) => {
  const [database, setDatabase] = useState<RxDatabase | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = await createRxDatabase({
          name: "db",
          storage: getRxStorageDexie(),
        });

        await db.addCollections({
          "cine-collection": {
            schema: CineEntrySchema,
          },
        });

        await db.addCollections({
          "cine-entry-seasons": {
            schema: CineEntrySeasonsSchema,
          },
        });

        await db.addCollections({
          "cine-entry-season-episodes": {
            schema: CineEntrySeasonEpisodesSchema,
          },
        });

        setDatabase(db);
      } catch (err: any) {
        if (err.code === "DB8" && err.rxdb) {
          console.warn("DB already exists");
        }
      }
    };
    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};

// A custom hook to access the database
export function useDatabase() {
  return useContext(DatabaseContext);
}
