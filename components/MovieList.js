import { StarIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { GlobalContext } from "../context/GlobalState";
import { database } from "../firebaseConfig";
import { classNames } from "../utilities";
import Info from "./Info";

const MovieList = ({ uid, showName }) => {
  const { setLoad, unknownError } = useContext(GlobalContext);
  const [completedList, setCompletedList] = useState(null);
  const userRef = doc(database, "completedList", uid);
  const [displayName, loading, error] = useDocumentData(userRef);
  useEffect(() => {
    setLoad(loading);
  }, [loading]);
  if (error) {
    unknownError();
    console.log(error);
  }
  useEffect(() => {
    const completedListRef = collection(
      database,
      "completedList",
      uid,
      "movies"
    );
    const q = query(
      completedListRef,
      orderBy("userRanking", "desc"),
      orderBy("movieTitle", "asc")
    );
    const result = [];
    setLoad(true);
    getDocs(q)
      .then((res) => {
        res.forEach((movie) => {
          result.push({
            id: movie.id,
            movieTitle: movie.data().movieTitle,
            userRanking: movie.data().userRanking,
            completedAt: movie.data().completedAt,
          });
        });
      })
      .catch(() => {})
      .finally(() => {
        setCompletedList(result);
        setLoad(false);
      });
  }, [uid]);

  if (completedList === null || displayName === undefined) {
    return <></>;
  } else if (completedList.length === 0) {
    return <Info description="You have not completed any movies yet." />;
  } else {
    return (
      <div className="py-10">
        {showName && (
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {`${displayName.displayName}'s Movie List`}
              </h1>
            </div>
          </header>
        )}
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Completed At
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">User Ranking</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {completedList.map((movie, movieIdx) => (
                          <tr
                            key={movieIdx}
                            className={
                              movieIdx % 2 === 0 ? undefined : "bg-gray-50"
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {movieIdx + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
                              <Link href={`/moviedb/${movie.id}`}>
                                {movie.movieTitle}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {movie.completedAt ? (
                                <time
                                  dateTime={format(
                                    movie.completedAt.toDate(),
                                    "yyyy-MM-dd"
                                  )}
                                >
                                  {format(
                                    movie.completedAt.toDate(),
                                    "MMMM dd, yyyy"
                                  )}
                                </time>
                              ) : (
                                <p title="Refresh the page to view updated date">
                                  -
                                </p>
                              )}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={classNames(
                                      movie.userRanking > rating
                                        ? "text-yellow-400"
                                        : "text-gray-300",
                                      "h-5 w-5 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default MovieList;
