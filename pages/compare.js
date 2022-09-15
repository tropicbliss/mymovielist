const compare = () => {
  return (
    <div className="pt-16 flex justify-center space-x-3 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <form onSubmit={(e) => redirectToMoviePage(e)}>
            <input
              id="search"
              name="search"
              className="block w-full text-xs rounded-md border border-transparent bg-gray-700 py-2 sm:pl-10 sm:pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
              placeholder="Search for movies"
              type="search"
            />
          </form>
        </div>
        <div className="border-t border-cyber-purple px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">Full name</dt>
              <dd className="mt-1 text-sm text-gray-300 sm:col-span-2 sm:mt-0">
                Margot Foster
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="overflow-hidden bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <form onSubmit={(e) => redirectToMoviePage(e)}>
            <input
              id="search"
              name="search"
              className="block w-full text-xs rounded-md border border-transparent bg-gray-700 py-2 sm:pl-10 sm:pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
              placeholder="Search for movies"
              type="search"
            />
          </form>
        </div>
        <div className="border-t border-cyber-purple px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">Full name</dt>
              <dd className="mt-1 text-sm text-gray-300 sm:col-span-2 sm:mt-0">
                Margot Foster
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default compare;
