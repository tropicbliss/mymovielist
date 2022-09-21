import Nav from "./Nav";
import Meta from "./Meta";
import Footer from "./Footer";
import Router from "next/router";
import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";

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
    <>
      <Meta />
      <Nav />
      <div>
        <LinearProgress
          color="success"
          className={loading ? "" : "invisible"}
        />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
