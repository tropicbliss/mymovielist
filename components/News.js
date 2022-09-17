const News = ({ articles, isShowTitle }) => {
  return (
    <div className="relative bg-gray-50 px-4 mt-16 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        {isShowTitle && (
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              News
            </h2>
          </div>
        )}
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {articles.map((post) => (
            <div
              key={post.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              {post.image && (
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post.image}
                    alt=""
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <a
                    href={post.url}
                    className="mt-2 block"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {post.content}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;