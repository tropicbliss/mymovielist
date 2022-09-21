import Nav from "./Nav";
import Meta from "./Meta";
import Footer from "./Footer";
import Router from "next/router";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });
    Router.events.on("routeChangeError", () => {
      setLoading(false);
    });

    return () => {
      Router.events.off("routeChangeStart", () => {
        setLoading(true);
      });
      Router.events.off("routeChangeComplete", () => {
        setLoading(false);
      });
      Router.events.off("routeChangeError", () => {
        setLoading(false);
      });
    };
  }, [Router.events]);

  return (
    <div className={loading ? "cursor-wait" : ""}>
      <Meta />
      <Nav />
      <div>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
