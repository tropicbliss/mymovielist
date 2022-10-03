import News from "../components/News";
import { getNews } from "../utilities";

export default function Home({ articles }) {
  return (
    <>
      <Hero />
      <News articles={articles} isShowTitle={true} />
    </>
  );
}

function Hero() {
  return (
    <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">
            Welcome to the premier movie watcher&apos;s paradise
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Get the latest entertainment news and movie info straight from us!
        </p>
      </div>
    </main>
  );
}

export const getServerSideProps = async () => {
  const articles = await getNews();
  return {
    props: {
      articles,
    },
  };
};
