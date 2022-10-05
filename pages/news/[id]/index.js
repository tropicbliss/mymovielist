import News from "../../../components/News";
import { getNews } from "../../../utilities";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import Warning from "../../../components/Warning";
import Link from "next/link";

const news = ({ articles, id }) => {
  return (
    <div className="mx-4">
      {articles.length === 0 ? (
        <Warning
          title="There is no more news to be found"
          description="Looks like the content well has dried up. Better luck next time."
        />
      ) : (
        <News articles={articles} />
      )}
      <Pagination totalPages={3} currentPage={id} />
    </div>
  );
};

function Pagination(props) {
  const { totalPages, currentPage } = props;
  const previous = currentPage == 1 ? currentPage : +currentPage - 1;
  const next = currentPage == totalPages ? currentPage : +currentPage + 1;

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Link href={`/news/${previous}`}>
          <a className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (page == currentPage) {
            return (
              <Link key={page} href={`/news/${page}`}>
                <a
                  className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                  aria-current="page"
                >
                  {page}
                </a>
              </Link>
            );
          } else {
            return (
              <Link key={page} href={`/news/${page}`}>
                <a className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                  {page}
                </a>
              </Link>
            );
          }
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link href={`/news/${next}`}>
          <a className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </a>
        </Link>
      </div>
    </nav>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const id = context.params.id;
    const page = Math.floor(id);
    if (page <= 0 || page > 3 || !page) {
      return {
        notFound: true,
      };
    }
    const articles = await getNews(page);
    return {
      props: {
        articles,
        id,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default news;
