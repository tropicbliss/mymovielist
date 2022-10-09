// Beware, for spaghetti code galore

import { auth, database } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Warning from "../components/Warning";
import { PlusIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { classNames } from "../utilities";
import { useContext, useEffect, useRef, useState, Fragment } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { GlobalContext } from "../context/GlobalState";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import MovieList from "../components/MovieList";

const Dashboard = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-3">
      {user ? (
        <Dash user={user} />
      ) : (
        <Warning
          title="Authentication needed"
          description="To access the dashboard, you need to be signed in."
        />
      )}
    </div>
  );
};

function Dash(props) {
  const { setToast, setNiceMsg } = useContext(GlobalContext);
  const { user } = props;
  const [isInWatchList, setIsInWatchList] = useState(true);
  const tabs = [
    { name: "Watch List", current: isInWatchList },
    { name: "Completed", current: !isInWatchList },
  ];
  const share = () => {
    if (typeof window !== "undefined") {
      const url = document.location.origin + "/movielist/" + user.uid;
      if (navigator.share) {
        navigator
          .share({
            title: "MyMovieList",
            text: "Check out MyMovieList.",
            url,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        navigator.clipboard.writeText(url);
        setNiceMsg(
          "Your browser does not support the Web Share API",
          "Your movie list URL is automatically copied to your clipboard."
        );
        setToast(true);
      }
    }
  };

  return (
    <div className="relative border-b border-gray-200 pb-5 sm:pb-0 mt-3 sm:mt-9">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Dashboard
        </h3>
        <div className="mt-3 flex md:absolute md:top-3 md:right-0 md:mt-0">
          {!isInWatchList && (
            <button
              type="button"
              onClick={share}
              className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Share
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.current).name}
            onChange={(e) => setIsInWatchList(e.target.value === "Watch List")}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setIsInWatchList(tab.name === "Watch List")}
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {isInWatchList ? (
        <WatchList user={user} changeTabs={() => setIsInWatchList(false)} />
      ) : (
        <MovieList uid={user.uid} showName={false} />
      )}
    </div>
  );
}

function NoMovie() {
  return (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No movies in watch list
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by finding a new movie to watch!
      </p>
      <div className="mt-6">
        <Link href="/ranking">
          <a>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Global Rank
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
}

function WatchList(props) {
  const { setLoad } = useContext(GlobalContext);
  const { user, changeTabs } = props;
  const [watchlist, setWatchlist] = useState(null);
  useEffect(() => {
    const watchlistRef = collection(
      database,
      "watchlist",
      user.uid,
      "watchlistMovies"
    );
    const result = [];
    setLoad(true);
    getDocs(watchlistRef)
      .then((res) => {
        res.forEach((movie) => {
          result.push({ id: movie.id, movieTitle: movie.data().movieTitle });
        });
      })
      .catch(() => {})
      .finally(() => {
        setWatchlist(result);
        setLoad(false);
      });
  }, [user]);
  const [openModal, setOpenModal] = useState(null);
  const resetField = () => {
    setWatchlist(watchlist.filter((movie) => movie.id !== openModal.id));
    setOpenModal(null);
    changeTabs();
  };

  if (watchlist === null) {
    return <></>;
  } else if (watchlist.length === 0) {
    return <NoMovie />;
  } else {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <WatchedModal
          initialOpen={openModal}
          resetField={() => resetField()}
          user={user}
        />
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table
                  className="min-w-full border-separate"
                  style={{ borderSpacing: 0 }}
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Watched</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {watchlist.map((movie, movieIdx) => (
                      <tr key={movieIdx}>
                        <td
                          className={classNames(
                            movieIdx !== watchlist.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                          )}
                        >
                          {movieIdx + 1}
                        </td>
                        <td
                          className={classNames(
                            movieIdx !== watchlist.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                          )}
                        >
                          {movie.movieTitle}
                        </td>
                        <td
                          className={classNames(
                            movieIdx !== watchlist.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                          )}
                        >
                          <button
                            onClick={() => setOpenModal(movie)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Watched
                            <span className="sr-only">
                              , {movie.movieTitle}
                            </span>
                          </button>
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
    );
  }
}

function WatchedModal(props) {
  const { setLoad, unknownError } = useContext(GlobalContext);
  const { initialOpen, resetField, user } = props;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(Boolean(initialOpen));
  }, [initialOpen]);
  const cancelButtonRef = useRef(null);
  const [stars, setStars] = useState(1);
  const submitMovie = async () => {
    const completedRef = doc(
      database,
      "completedList",
      user.uid,
      "movies",
      initialOpen.id
    );
    const deletedRef = doc(
      database,
      "watchlist",
      user.uid,
      "watchlistMovies",
      initialOpen.id
    );
    const userRef = doc(database, "completedList", user.uid);
    setLoad(true);
    try {
      await Promise.all([
        setDoc(completedRef, {
          movieTitle: initialOpen.movieTitle,
          userRanking: stars,
          completedAt: serverTimestamp(),
        }),
        setDoc(
          userRef,
          {
            displayName: user.displayName,
          },
          { merge: true }
        ),
        deleteDoc(deletedRef),
      ]);
    } catch (e) {
      unknownError();
      console.log(e);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Rate Movie
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col items-center space-y-1">
                      <p className="text-sm text-gray-500">
                        How much did you enjoy the movie?
                      </p>
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            onClick={() => setStars(rating + 1)}
                            className={classNames(
                              stars > rating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "h-5 w-5 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      resetField();
                      setStars(1);
                      submitMovie();
                    }}
                  >
                    Rate Movie
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      resetField();
                      setStars(1);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Dashboard;
