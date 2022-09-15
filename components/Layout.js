import Nav from "./Nav";
import Meta from "./Meta";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <Nav />
      <div>
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
