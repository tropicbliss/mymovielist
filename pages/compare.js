import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { getMovieInfo, getMovieInfoFromTitle } from "../utilities";
import { GlobalContext } from "../context/GlobalState";

const Compare = ({ startingInfo1, startingInfo2 }) => {
  const { setToast, setErrorMsg, unknownError } = useContext(GlobalContext);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [movieInfo1, setMovieInfo1] = useState(startingInfo1);
  const [movieInfo2, setMovieInfo2] = useState(startingInfo2);
  const { setLoad } = useContext(GlobalContext);
  useEffect(() => {
    if (movieInfo1 && movieInfo2) {
      setLoad(false);
    } else {
      setLoad(true);
    }
  }, [movieInfo1, movieInfo2]);
  const onSubmit = async (e, searchNum) => {
    e.preventDefault();
    const search = searchNum === 1 ? search1 : search2;
    const setMovieInfo = searchNum === 1 ? setMovieInfo1 : setMovieInfo2;
    const setSearch = searchNum === 1 ? setSearch1 : setSearch2;
    if (search === "") {
      setErrorMsg("Error comparing movies", "Movie entered cannot be empty.");
      setToast(true);
      return;
    }
    setLoad(true);
    try {
      const data = await getMovieInfoFromTitle(search);
      if (!data.info) {
        setErrorMsg(
          "Error comparing movies",
          "We were unable to find the movie you were looking for."
        );
        setToast(true);
      } else {
        setMovieInfo(data);
      }
    } catch (e) {
      unknownError();
    } finally {
      setSearch("");
      setLoad(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16">
      <h1 className="text-center mb-16 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Compare movies
      </h1>
      <div className="grid grid-cols-2 space-x-3">
        <div className="relative mt-1 mb-3 rounded-md shadow-sm">
          <form onSubmit={(e) => onSubmit(e, 1)}>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
              placeholder="Spider-Man: No Way Home"
              value={search1}
              onChange={(e) => setSearch1(e.target.value)}
            />
          </form>
        </div>
        <div className="relative mt-1 mb-3 rounded-md shadow-sm">
          <form onSubmit={(e) => onSubmit(e, 2)}>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
              placeholder="Top Gun: Maverick"
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
            />
          </form>
        </div>
        <div className="p-3">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {movieInfo1.info.Title}
          </h2>
        </div>
        <div className="p-3">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {movieInfo2.info.Title}
          </h2>
        </div>
        <div className="p-3 flex justify-center">
          {movieInfo1.poster ? (
            <Image
              className="rounded"
              src={movieInfo1.poster}
              height="182px"
              width="146px"
              alt={`Movie poster of ${movieInfo1.info.Title}`}
            />
          ) : (
            <p>Image cannot be loaded</p>
          )}
        </div>
        <div className="p-3 flex justify-center">
          {movieInfo2.poster ? (
            <Image
              className="rounded"
              src={movieInfo2.poster}
              height="182px"
              width="146px"
              alt={`Movie poster of ${movieInfo2.info.Title}`}
            />
          ) : (
            <p>Image cannot be loaded</p>
          )}
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Year ? movieInfo1.info.Year : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Year ? movieInfo2.info.Year : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Released ? movieInfo1.info.Released : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Released ? movieInfo2.info.Released : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Runtime ? movieInfo1.info.Runtime : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Runtime ? movieInfo2.info.Runtime : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Genre ? movieInfo1.info.Genre : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Genre ? movieInfo2.info.Genre : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Metascore
              ? "Metascore: " + movieInfo1.info.Metascore
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Metascore
              ? "Metascore: " + movieInfo2.info.Metascore
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.imdbRating
              ? "IMDb Rating: " + movieInfo1.info.imdbRating
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.imdbRating
              ? "IMDb Rating: " + movieInfo2.info.imdbRating
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.tomatoMeter
              ? "Rotten Tomatoes: " + movieInfo1.info.tomatoMeter
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.tomatoMeter
              ? "Rotten Tomatoes: " + movieInfo2.info.tomatoMeter
              : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.BoxOffice ? movieInfo1.info.BoxOffice : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.BoxOffice ? movieInfo2.info.BoxOffice : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo1.info.Production ? movieInfo1.info.Production : "-"}
          </p>
        </div>
        <div className="p-3">
          <p className="text-center text-base sm:text-xl font-bold text-gray-900">
            {movieInfo2.info.Production ? movieInfo2.info.Production : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const startingInfo1 = await getMovieInfo("tt10872600");
    const startingInfo2 = await getMovieInfo("tt1745960");
    return {
      props: {
        startingInfo1,
        startingInfo2,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default Compare;
