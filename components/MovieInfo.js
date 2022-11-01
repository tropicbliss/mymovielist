import { StarIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utilities";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { format } from "date-fns";
import { GlobalContext } from "../context/GlobalState";
import Image from "next/image";
import Avatar from "./Avatar";

function getStars(imdbRating) {
  if (!imdbRating) {
    return null;
  }
  return Math.round(imdbRating / 2);
}

const MovieInfo = ({ movieInfo, id }) => {
  const { setToast, setErrorMsg, unknownError, setLoad } =
    useContext(GlobalContext);
  const tableInfo = JSON.parse(JSON.stringify(movieInfo));
  delete tableInfo.poster;
  delete tableInfo.info.Title;
  delete tableInfo.info.Plot;
  const stars = getStars(movieInfo.info.imdbRating);
  const imdbLink = `https://www.imdb.com/title/${id}/`;
  const [user] = useAuthState(auth);
  const [review, setReview] = useState("");
  const reviewsRef = collection(database, "reviews", id, "review");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const [reviews, loading, error] = useCollectionData(q);
  useEffect(() => {
    setLoad(loading);
  }, [loading]);
  if (error) {
    unknownError();
    console.log(error);
  }
  useEffect(() => {
    if (reviews === null) {
      setLoad(true);
    } else {
      setLoad(false);
    }
  }, [reviews]);
  const sendReview = async (e) => {
    e.preventDefault();
    if (review === "") {
      setErrorMsg("Error sending review", "Review cannot be empty.");
      setToast(true);
      return;
    }
    setLoad(true);
    const { displayName, photoURL, uid } = user;
    try {
      await addDoc(collection(database, "reviews", id, "review"), {
        createdAt: serverTimestamp(),
        displayName,
        photoURL,
        text: review,
        uid,
      });
      setReview("");
    } catch (e) {
      unknownError();
      console.log(e);
    } finally {
      setLoad(false);
    }
  };
  const [isWatched, setIsWatched] = useState(null);
  useEffect(() => {
    if (!user) {
      setIsWatched(null);
      return;
    }
    const watchedDocRef = doc(
      database,
      "watchlist",
      user.uid,
      "watchlistMovies",
      id
    );
    setLoad(true);
    getDoc(watchedDocRef)
      .then((watchedDocSnap) => {
        setIsWatched(watchedDocSnap.exists());
      })
      .catch((e) => {
        unknownError();
        console.log(e);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [user, id]);
  const handleWatchListAction = async () => {
    setLoad(true);
    const docRef = doc(database, "watchlist", user.uid, "watchlistMovies", id);
    try {
      if (isWatched) {
        await deleteDoc(docRef);
      } else {
        const completedListRef = doc(
          database,
          "completedList",
          user.uid,
          "movies",
          id
        );
        const isInCompletedList = await (
          await getDoc(completedListRef)
        ).exists();
        if (isInCompletedList) {
          setErrorMsg(
            "Error adding movie to watch list",
            "You already watched the movie."
          );
          setToast(true);
          return;
        }
        await setDoc(docRef, {
          movieTitle: movieInfo.info.Title,
        });
      }
      setIsWatched(!isWatched);
    } catch (e) {
      unknownError();
      console.log(e);
    } finally {
      setLoad(false);
    }
  };
  const makeNicerHeading = (heading) => {
    switch (heading) {
      case "imdbRating":
        return "IMDb Rating";
      case "BoxOffice":
        return "Box Office";
      case "tomatoMeter":
        return "Rotten Tomatoes";
      default:
        return heading;
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
              {movieInfo.poster && (
                <Image
                  className="object-cover object-center"
                  sizes="100vw"
                  fill
                  src={movieInfo.poster}
                  alt="Movie poster"
                  priority
                />
              )}
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {movieInfo.info.Title}
                </h1>
              </div>

              {stars && (
                <div>
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          stars > rating ? "text-yellow-400" : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{stars} out of 5 stars</p>
                </div>
              )}
            </div>

            <p className="mt-6 text-gray-500">{movieInfo.info.Plot}</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {isWatched !== null && (
                <button
                  type="button"
                  onClick={() => handleWatchListAction()}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-cyber-purple py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  {isWatched ? "Remove from watch list" : "Add to watch list"}
                </button>
              )}
              <a
                href={imdbLink}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 py-3 px-8 text-base font-medium text-cyber-purple hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                View on IMDb
              </a>
            </div>

            <div className="overflow-hidden bg-white shadow mt-3 sm:rounded-lg">
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {Object.entries(tableInfo.info).map(
                    (e) =>
                      e[1] && (
                        <div
                          key={e[0]}
                          className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6"
                        >
                          <dt className="text-sm font-medium text-gray-500">
                            {makeNicerHeading(e[0])}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {e[1]}
                          </dd>
                        </div>
                      )
                  )}
                </dl>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
            {user && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Avatar
                    profileURL={user.photoURL}
                    initials={user.displayName.charAt(0).toUpperCase()}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <form className="relative" onSubmit={sendReview}>
                    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-cyber-purple focus-within:ring-1 focus-within:ring-cyber-purple">
                      <label htmlFor="comment" className="sr-only">
                        Add your review
                      </label>
                      <textarea
                        rows={3}
                        name="comment"
                        id="comment"
                        className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                        placeholder="Add your review..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />

                      {/* Spacer element to match the height of the toolbar */}
                      <div className="py-2" aria-hidden="true">
                        {/* Matches height of button in toolbar (1px border + 36px content height) */}
                        <div className="py-px">
                          <div className="h-9" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
                      <div className="flex-shrink-0">
                        <button
                          type="submit"
                          className="inline-flex items-center rounded-md border border-transparent bg-cyber-purple px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyber-purple focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:ring-offset-2"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {!loading &&
              reviews.map((r, idx) => (
                <div key={idx} className="flex space-x-4 text-sm text-gray-500">
                  <div className="flex-none py-10">
                    <Avatar
                      profileURL={r.photoURL}
                      initials={user.displayName.charAt().toUpperCase()}
                    />
                  </div>
                  <div
                    className={classNames(
                      idx === 0 ? "" : "border-t border-gray-200",
                      "py-10"
                    )}
                  >
                    <h3 className="font-medium text-gray-900">
                      {r.displayName}
                    </h3>
                    <p>
                      <time
                        dateTime={
                          r.createdAt &&
                          format(r.createdAt.toDate(), "yyyy-MM-dd")
                        }
                      >
                        {r.createdAt &&
                          format(r.createdAt.toDate(), "MMMM dd, yyyy")}
                      </time>
                    </p>

                    <div className="prose prose-sm mt-4 max-w-none text-gray-500">
                      <p>{r.text}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
