import { useEffect, useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import { useNavigate } from "react-router-dom";
import { URLS } from "../apis/tmdb";

export const CineCollection = () => {
  const navigate = useNavigate();
  const db = useDatabase();
  const [cineEntries, setCineEntries] = useState<any>(null);

  useEffect(() => {
    const cineCollection = db?.["cine-collection"];
    const cineEntries$ = cineCollection?.find().$.subscribe((cineEntries) => {
      setCineEntries(cineEntries);
    });

    return () => {
      cineEntries$?.unsubscribe();
    };
  }, [db]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {cineEntries?.map((cineEntry: any) => (
        <div
          onClick={() => navigate(cineEntry.id)}
          key={cineEntry.id}
          className="relative group/movie cursor-pointer"
        >
          <img
            className="rounded-md"
            loading="lazy"
            src={`${URLS.IMAGE_URL}${cineEntry.posterPath}`}
            alt="Poster"
          />

          <div className="min-h-[4rem] absolute flex text-center items-center justify-center w-full px-4 py-4 rounded-b bottom-0 bg-neutral-800/70 backdrop-blur-md">
            <h1 className="font-semibold">{cineEntry.title}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};
