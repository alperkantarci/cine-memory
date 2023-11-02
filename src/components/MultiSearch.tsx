import { ChangeEvent, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { useDatabase } from "../contexts/DatabaseContext";
import { URLS, tmdbApi } from "../apis/tmdb";

interface TmdbCineEntry {
  id: number;
  title: string;
  name: string;
  media_type: "movie" | "tv";
  release_date: string;
  poster_path: string;
}

export const MultiSearch = () => {
  const db = useDatabase();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [movies, setMovies] = useState<any>(null);
  const [error, setError]: any = useState(null);

  const getMovies = (query: string) => {
    tmdbApi
      .get(`${URLS.SEARCH_MULTI}?${query}`)
      .then((response) => {
        setMovies(response?.data?.results);
        setError(null);
      })
      .catch((error) => {
        setError(error);
        setMovies(null);
      });
  };

  const getParamString = (params: any) =>
    Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

  const handleSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchKeyword(value);
  };

  const search = (event: any) => {
    event.preventDefault();

    const searchParams: any = {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      query: searchKeyword,
    };
    const query = getParamString(searchParams);
    getMovies(query);
  };

  const addToMyLibrary = (cineEntry: TmdbCineEntry) => {
    const cineCollection = db?.["cine-collection"];
    cineCollection?.insert({
      id: cineEntry.id.toString(),
      title: cineEntry.title || cineEntry.name,
      type: cineEntry.media_type,
      posterPath: cineEntry.poster_path,
      releaseDate: cineEntry.release_date,
      watched: true,
    });
  };

  return (
    <>
      <form className="flex items-center gap-2 py-3" onSubmit={search}>
        <input
          type="text"
          placeholder="Type to search"
          onChange={handleSearchValue}
          value={searchKeyword}
        />
        <button type="submit" className="bg-rose-700 px-4 py-3 rounded-md">
          Search
        </button>
      </form>

      {error && <p className="text-rose-500 py-4">{error?.message}</p>}

      {!error && movies?.length === 0 && (
        <p className="text-neutral-500 py-4">No data available!</p>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {movies?.length > 0 &&
          movies?.map((movie: any) => (
            <div key={movie.id} className="relative group/movie">
              <img
                className="rounded-md"
                loading="lazy"
                src={`${URLS.IMAGE_URL}${movie.poster_path}`}
                alt="Poster"
              />

              <div className="min-h-[4rem] absolute flex text-center items-center justify-center w-full px-4 py-4 rounded-b bottom-0 bg-neutral-800/70 backdrop-blur-md">
                <h1 className="font-semibold">{movie.title || movie.name}</h1>
              </div>

              <button
                onClick={() => addToMyLibrary(movie)}
                className="group-hover/movie:flex absolute hidden items-center hover:bg-neutral-950/70 text-green-500 text-3xl right-0 top-0 px-2 py-2 bg-neutral-900/70 backdrop-blur-md rounded-bl rounded-tr"
              >
                <GoPlusCircle></GoPlusCircle>
              </button>
            </div>
          ))}
      </div>
    </>
  );
};
