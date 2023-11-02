import { useParams } from "react-router-dom";
import { useDatabase } from "../contexts/DatabaseContext";
import { ChangeEvent, useEffect, useState } from "react";
import { URLS, tmdbApi } from "../apis/tmdb";

export const CineEntry = () => {
  const { id } = useParams();
  const db = useDatabase();

  const [cineEntry, setCineEntry] = useState<any>(null);
  const [seasons, setSeasons] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any>(null);
  const [localEpisodes, setLocalEpisodes] = useState<any>(null);

  useEffect(() => {
    const cineCollection = db?.["cine-collection"];
    const cineEntry$ = cineCollection
      ?.findOne({
        selector: {
          id,
        },
      })
      .$.subscribe((cineEntry) => {
        setCineEntry(cineEntry);
      });

    const cineEntrySeasonEpisodes = db?.["cine-entry-season-episodes"];
    const localEpisodes$ = cineEntrySeasonEpisodes
      ?.find({
        selector: {
          seasonNumber: 0,
        },
      })
      .$.subscribe((episodes) => {
        setLocalEpisodes(episodes);
      });

    return () => {
      cineEntry$?.unsubscribe();
      localEpisodes$?.unsubscribe();
    };
  }, [db, id]);

  useEffect(() => {
    const url = `${URLS.TV_SERIES_DETAILS}/${id}`;
    tmdbApi.get(url).then((res) => setSeasons(res.data.seasons));
  }, [id]);

  useEffect(() => {
    if (seasons?.length > 0) {
      const url = `${URLS.TV_SERIES_DETAILS}/${id}`;
      const firstSeason = seasons?.[0];
      tmdbApi
        .get(`${url}/season/${firstSeason?.season_number}`)
        .then((res) => setEpisodes(res.data.episodes));
    }
  }, [id, seasons]);

  function getEpisodeWatched(episode: any): boolean {
    const _episode = localEpisodes?.find(
      (e: any) => e.episodeId === episode.id.toString()
    );
    return _episode?.watched || false;
  }

  const setWatched = (event: ChangeEvent<HTMLInputElement>): void => {
    const watched = event.target.checked;

    cineEntry?.update({
      $set: {
        watched,
      },
    });
  };

  const setWatchedEpisode = (
    event: ChangeEvent<HTMLInputElement>,
    episode: any
  ): void => {
    const watched = event.target.checked;

    const seasonId = seasons.find(
      (season: any) => season.season_number === episode.season_number
    ).id;

    const cineEntrySeasons = db?.["cine-entry-seasons"];
    cineEntrySeasons?.upsert({
      cineEntryId: cineEntry?.id,
      seasonId: seasonId.toString(),
      seasonNumber: episode.season_number,
      watched: false,
    });

    const cineEntrySeasonEpisodes = db?.["cine-entry-season-episodes"];
    cineEntrySeasonEpisodes?.upsert({
      episodeId: episode.id.toString(),
      seasonNumber: episode.season_number,
      episodeNumber: episode.episode_number,
      title: episode.name,
      watched,
    });
  };

  const uppercase = (str: string) => {
    return str?.toUpperCase();
  };

  return (
    <div>
      <div className="relative h-64">
        <img
          className="absolute top-0 rounded-md h-64 w-full object-cover"
          loading="lazy"
          src={`${URLS.IMAGE_URL}${cineEntry?.posterPath}`}
          alt="Poster"
        ></img>

        <div className="w-full h-64 top-0 absolute backdrop-blur-md rounded-md"></div>

        <img
          className="absolute top-0 rounded-md h-64 w-full object-contain"
          loading="lazy"
          src={`${URLS.IMAGE_URL}${cineEntry?.posterPath}`}
          alt="Poster"
        ></img>
      </div>

      <h1 className="text-2xl mt-6">{cineEntry?.title}</h1>

      <p className="text-neutral-700 font-semibold">
        {uppercase(cineEntry?.type)}
      </p>

      {cineEntry?.type === "movie" && (
        <div className="mt-6 flex items-center gap-4">
          <input
            onChange={(event) => setWatched(event)}
            className="w-max cursor-pointer"
            id="check"
            type="checkbox"
            checked={cineEntry?.watched}
            value={cineEntry?.watched}
          />
          <label htmlFor="check" className="cursor-pointer">
            Watched
          </label>
        </div>
      )}

      {cineEntry?.type === "tv" && (
        <div className="h-72 flex mt-10 border-2 border-neutral-800 rounded-md">
          <ul className="w-1/2 flex flex-col overflow-auto border-r-2 border-neutral-800">
            {seasons?.map(
              (season: {
                id: number;
                name: string;
                season_number: number;
                episode_count: number;
              }) => {
                return (
                  <li
                    key={season.id}
                    className="border-neutral-800 bg-neutral-800/40 px-8 py-4 border-b-2 flex gap-2"
                  >
                    <span>{season.name}</span>
                    <span className="text-neutral-600">
                      ({season.episode_count})
                    </span>
                  </li>
                );
              }
            )}
          </ul>

          <ul className="px-6 py-4 flex-grow flex flex-col gap-4 overflow-auto">
            {episodes?.map(
              (episode: {
                id: number;
                name: string;
                episode_number: number;
              }) => {
                return (
                  <li
                    key={episode.id}
                    className="flex justify-between px-4 py-4 bg-neutral-800/40 rounded-md"
                  >
                    <div>
                      <p>Episode {episode.episode_number}</p>
                      <p className="text-neutral-600 text-sm">{episode.name}</p>
                    </div>
                    <div className="px-4 flex items-center">
                      <input
                        type="checkbox"
                        className="w-max cursor-pointer"
                        title="Watched"
                        checked={getEpisodeWatched(episode)}
                        onChange={(event) => setWatchedEpisode(event, episode)}
                      />
                    </div>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
