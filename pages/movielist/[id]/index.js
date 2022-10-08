import { doc, getDoc } from "firebase/firestore";
import MovieList from "../../../components/MovieList";
import { database } from "../../../firebaseConfig";

const index = ({ id }) => {
  return <MovieList uid={id} showName={true} />;
};

export const getServerSideProps = async (context) => {
  let id = context.params.id;
  try {
    const userRef = doc(database, "completedList", id);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
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
