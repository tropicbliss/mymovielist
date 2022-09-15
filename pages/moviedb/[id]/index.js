import MovieInfo from "../../../components/MovieInfo";
import { getMovieInfo } from "../../../utilities";

const index = ({ movieInfo, id }) => {
  return <MovieInfo movieInfo={movieInfo} id={id} />;
};

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  const movieInfo = await getMovieInfo(id);
  return {
    props: {
      movieInfo,
      id,
    },
  };
};

export default index;
