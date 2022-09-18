import { useEffect, useState } from "react";
import Image from "next/image";
import { getMovieInfo, getMovieInfoFromTitle } from "../utilities";
import Toast from "../components/Toast";

const compare = () => {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [movieInfo1, setMovieInfo1] = useState(null);
  const [movieInfo2, setMovieInfo2] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    getMovieInfo("tt10872600").then((e) => {
      setMovieInfo1(e);
    });
    getMovieInfo("tt1745960").then((e) => {
      setMovieInfo2(e);
    });
  }, []);
  const getMovieInfo = async (e, searchNum) => {
    e.preventDefault();
    const search = searchNum === 1 ? search1 : search2;
    const setMovieInfo = searchNum === 1 ? setMovieInfo1 : setMovieInfo2;
    const setSearch = searchNum === 1 ? setSearch1 : setSearch2;
    if (search === "") {
      setErrorMsg("Movie entered cannot be empty.");
      setShow(true);
      return;
    }
    const data = await getMovieInfoFromTitle(search);
    if (!data.info) {
      setErrorMsg("We were unable to find the movie you were looking for.");
      setShow(true);
      return;
    }
    setMovieInfo(data);
    setSearch("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <Toast
        show={show}
        setShow={setShow}
        isSuccess={false}
        title="An error occured while searching"
        description={errorMsg}
      />
      <h1 className="text-center mb-16 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Compare movies
      </h1>
      <div className="grid grid-cols-2 space-x-3">
        <>
          <div className="relative mt-1 rounded-md shadow-sm">
            <form onSubmit={(e) => getMovieInfo(e, 1)}>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
                placeholder="Spider-Man: No Way Home"
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
              />
            </form>
          </div>
        </>
        <>
          <div className="relative mt-1 rounded-md shadow-sm">
            <form onSubmit={(e) => getMovieInfo(e, 2)}>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
                placeholder="Top Gun: Maverick"
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
              />
            </form>
          </div>
        </>
      </div>
    </div>
  );
};

export default compare;
