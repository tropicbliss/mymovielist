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
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { database } from "../firebaseConfig";
import { classNames } from "../utilities";

const MovieList = ({ uid, showName }) => {
  const { setLoad } = useContext(GlobalContext);
  const [completedList, setCompletedList] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  useEffect(() => {
    const completedListRef = collection(
      database,
      "completedList",
      uid,
      "movies"
    );
    const q = query(completedListRef, orderBy("userRanking", "desc"));
    const userRef = doc(database, "completedList", uid);
    const result = [];
    setLoad(true);
    Promise.all([getDocs(q), getDoc(userRef)])
      .then(([res, userData]) => {
        res.forEach((movie) => {
          result.push({
            id: movie.id,
            movieTitle: movie.data().movieTitle,
            userRanking: movie.data().userRanking,
            completedAt: movie.data().completedAt,
          });
        });
        setDisplayName(userData.data().displayName);
      })
      .catch(() => {})
      .finally(() => {
        setCompletedList(result);
        setLoad(false);
      });
  }, [uid]);

  if (completedList === null || displayName === null) {
    return <></>;
  } else {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          {showName && (
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">{`${displayName}'s Movie List`}</h1>
            </div>
          )}
        </div>
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
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
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Completed Date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">User Rating</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {completedList.map((movie, movieIdx) => (
                <tr key={movieIdx}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {movieIdx + 1}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Title</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {movie.movieTitle}
                      </dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden">
                        <time
                          dateTime={format(
                            movie.completedAt.toDate(),
                            "yyyy-MM-dd"
                          )}
                        >
                          {format(movie.completedAt.toDate(), "MMMM dd, yyyy")}
                        </time>
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {movie.movieTitle}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <time
                      dateTime={format(
                        movie.completedAt.toDate(),
                        "yyyy-MM-dd"
                      )}
                    >
                      {format(movie.completedAt.toDate(), "MMMM dd, yyyy")}
                    </time>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
    );
  }
};

export default MovieList;
