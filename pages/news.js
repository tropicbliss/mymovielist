import News from "../components/News";
import { getNews } from "../utilities";

const news = ({ articles }) => {
  return <News articles={articles} />;
};

export const getServerSideProps = async () => {
  const articles = await getNews();
  return {
    props: {
      articles,
    },
  };
};

export default news;
