import MovieInfo from "../../../components/MovieInfo";
import { getMovieInfo } from "../../../utilities";

const index = ({ movieInfo, id }) => {
  return <MovieInfo movieInfo={movieInfo} id={id} />;
};

export const getServerSideProps = async (context) => {
  try {
    const id = context.params.id;
    const movieInfo = await getMovieInfo(id);
    if (!movieInfo.info) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        movieInfo,
        id,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default index;
