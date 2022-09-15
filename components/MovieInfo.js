import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getStars(imdbRating) {
  if (imdbRating === null) {
    return null;
  }
  return Math.round(imdbRating / 2);
}

const MovieInfo = ({ movieInfo, id }) => {
  const tableInfo = JSON.parse(JSON.stringify(movieInfo));
  delete tableInfo.poster;
  delete tableInfo.info.Title;
  delete tableInfo.info.Plot;
  const stars = getStars(movieInfo.info.imdbRating);
  const imdbLink = `https://www.imdb.com/title/${id}/`;

  return (
    <div className="bg-white">
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={movieInfo.poster}
                alt="Poster of the movie"
                className="object-cover object-center"
              />
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
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Add to watch list
              </button>
              <a
                href={imdbLink}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 py-3 px-8 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
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
                            {e[0]}
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
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
