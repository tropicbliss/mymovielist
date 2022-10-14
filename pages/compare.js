import { useContext, useEffect, useState } from "react";
import Image from "next/future/image";
import { getMovieInfo, getMovieInfoFromTitle, classNames } from "../utilities";
import { GlobalContext } from "../context/GlobalState";
import { Fragment } from "react";
import Link from "next/link";

const Compare = ({ startingInfo1, startingInfo2, startingInfo3 }) => {
  const { setToast, setErrorMsg, unknownError } = useContext(GlobalContext);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [movieInfo1, setMovieInfo1] = useState(startingInfo1);
  const [movieInfo2, setMovieInfo2] = useState(startingInfo2);
  const [movieInfo3, setMovieInfo3] = useState(startingInfo3);
  const baseMovieInfoLink = "/moviedb/";
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
    const search =
      searchNum === 1 ? search1 : searchNum === 2 ? search2 : search3;
    const setMovieInfo =
      searchNum === 1
        ? setMovieInfo1
        : searchNum === 2
        ? setMovieInfo2
        : setMovieInfo3;
    const setSearch =
      searchNum === 1 ? setSearch1 : searchNum === 2 ? setSearch2 : setSearch3;
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
      console.log(e);
    } finally {
      setSearch("");
      setLoad(false);
    }
  };
  const movies = [
    {
      title: movieInfo1.info.Title,
      poster: movieInfo1.poster,
      link: baseMovieInfoLink + movieInfo1.id,
    },
    {
      title: movieInfo2.info.Title,
      poster: movieInfo2.poster,
      link: baseMovieInfoLink + movieInfo2.id,
    },
    {
      title: movieInfo3.info.Title,
      poster: movieInfo3.poster,
      link: baseMovieInfoLink + movieInfo3.id,
    },
  ];
  const sections = [
    {
      name: "Stats",
      features: [
        {
          name: "Year",
          values: [
            movieInfo1.info.Year,
            movieInfo2.info.Year,
            movieInfo3.info.Year,
          ],
        },
        {
          name: "Released",
          values: [
            movieInfo1.info.Released,
            movieInfo2.info.Released,
            movieInfo3.info.Released,
          ],
        },
        {
          name: "Runtime",
          values: [
            movieInfo1.info.Runtime,
            movieInfo2.info.Runtime,
            movieInfo3.info.Runtime,
          ],
        },
        {
          name: "Genre",
          values: [
            movieInfo1.info.Genre,
            movieInfo2.info.Genre,
            movieInfo3.info.Genre,
          ],
        },
        {
          name: "Box Office",
          values: [
            movieInfo1.info.BoxOffice,
            movieInfo2.info.BoxOffice,
            movieInfo3.info.BoxOffice,
          ],
        },
        {
          name: "Production",
          values: [
            movieInfo1.info.Production,
            movieInfo2.info.Production,
            movieInfo3.info.Production,
          ],
        },
      ],
    },
    {
      name: "Review scores",
      features: [
        {
          name: "Metacritic",
          values: [
            movieInfo1.info.Metascore,
            movieInfo2.info.Metascore,
            movieInfo3.info.Metascore,
          ],
        },
        {
          name: "IMDb",
          values: [
            movieInfo1.info.imdbRating,
            movieInfo2.info.imdbRating,
            movieInfo3.info.imdbRating,
          ],
        },
        {
          name: "Rotten Tomatoes",
          values: [
            movieInfo1.info.tomatoMeter,
            movieInfo2.info.tomatoMeter,
            movieInfo3.info.tomatoMeter,
          ],
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16">
      <h1 className="text-center mb-16 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Compare movies
      </h1>
      <div className="grid lg:grid-cols-3 grid-rows-3 lg:space-x-3">
        <div className="relative mt-1 rounded-md shadow-sm mb-3 lg:mb-0">
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
        <div className="relative mt-1 rounded-md shadow-sm mb-3 lg:mb-0">
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
        <div className="relative mt-1 rounded-md shadow-sm mb-3 lg:mb-0">
          <form onSubmit={(e) => onSubmit(e, 3)}>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
              placeholder="Avatar"
              value={search3}
              onChange={(e) => setSearch3(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl bg-white sm:px-6 lg:px-8">
          {/* xs to lg */}
          <div className="mx-auto max-w-2xl space-y-16 lg:hidden">
            {movies.map((movie, movieIdx) => (
              <section key={movieIdx}>
                <div className="mb-8 px-4">
                  <Link href={movie.link}>
                    <a>
                      <h2 className="text-lg mb-3 font-medium leading-6 underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
                        {movie.title}
                      </h2>
                      {movie.poster ? (
                        <Image
                          className="rounded"
                          src={movie.poster}
                          height="182"
                          width="146"
                          alt={`Movie poster of ${movie.title}`}
                          priority
                        />
                      ) : (
                        <p>Image cannot be loaded</p>
                      )}
                    </a>
                  </Link>
                </div>

                {sections.map((section) => (
                  <table key={section.name} className="w-full">
                    <caption className="border-t border-gray-200 bg-gray-50 py-3 px-4 text-left text-sm font-medium text-gray-900">
                      {section.name}
                    </caption>
                    <thead>
                      <tr>
                        <th className="sr-only" scope="col">
                          Key
                        </th>
                        <th className="sr-only" scope="col">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {section.features.map((feature) => (
                        <tr
                          key={feature.name}
                          className="border-t border-gray-200"
                        >
                          <th
                            className="py-5 px-4 text-left text-sm font-normal text-gray-500"
                            scope="row"
                          >
                            {feature.name}
                          </th>
                          <td className="py-5 pr-4">
                            <span className="block text-right text-sm text-gray-700">
                              {feature.values[movieIdx]
                                ? feature.values[movieIdx]
                                : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </section>
            ))}
          </div>

          {/* lg+ */}
          <div className="hidden lg:block">
            <table className="h-px w-full table-fixed">
              <caption className="sr-only">Movie comparison</caption>
              <thead>
                <tr>
                  <th
                    className="px-6 pb-4 text-left text-sm font-medium text-gray-900"
                    scope="col"
                  >
                    <span className="sr-only">Comparison by</span>
                    <span>Movies</span>
                  </th>
                  {movies.map((movie, movieIdx) => (
                    <Link href={movie.link} key={movieIdx}>
                      <th
                        className="w-1/4 cursor-pointer px-6 pb-4 text-left text-lg font-medium leading-6 underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        scope="col"
                      >
                        {movie.title}
                      </th>
                    </Link>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                <tr>
                  <th
                    className="py-8 px-6 text-left align-top text-sm font-medium text-gray-900"
                    scope="row"
                  >
                    Poster
                  </th>
                  {movies.map((movie, movieIdx) => (
                    <td key={movieIdx} className="h-full py-8 px-6 align-top">
                      <div className="relative table h-full">
                        <Link href={movie.link}>
                          <a>
                            {movie.poster ? (
                              <Image
                                className="rounded"
                                src={movie.poster}
                                height="182"
                                width="146"
                                alt={`Movie poster of ${movie.title}`}
                                priority
                              />
                            ) : (
                              <p>Image cannot be loaded</p>
                            )}
                          </a>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
                {sections.map((section) => (
                  <Fragment key={section.name}>
                    <tr>
                      <th
                        className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900"
                        colSpan={4}
                        scope="colgroup"
                      >
                        {section.name}
                      </th>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name}>
                        <th
                          className="py-5 px-6 text-left text-sm font-normal text-gray-500"
                          scope="row"
                        >
                          {feature.name}
                        </th>
                        {movies.map((movie, movieIdx) => (
                          <td key={movieIdx} className="py-5 px-6">
                            <span className="block text-sm text-gray-700">
                              {feature.values[movieIdx]
                                ? feature.values[movieIdx]
                                : "-"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const movie1Id = "tt10872600";
    const movie2Id = "tt1745960";
    const movie3Id = "tt0499549";
    const [startingInfo1, startingInfo2, startingInfo3] = await Promise.all([
      getMovieInfo(movie1Id),
      getMovieInfo(movie2Id),
      getMovieInfo(movie3Id),
    ]);
    return {
      props: {
        startingInfo1: { ...startingInfo1, id: movie1Id },
        startingInfo2: { ...startingInfo2, id: movie2Id },
        startingInfo3: { ...startingInfo3, id: movie3Id },
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default Compare;
