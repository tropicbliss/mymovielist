import Nav from "./Nav";
import Meta from "./Meta";
import Footer from "./Footer";
import { GlobalProvider } from "../context/GlobalState";

const Layout = ({ children }) => {
  return (
    <div>
      <Meta />
      <GlobalProvider>
        <Nav />
        <div>
          <main>{children}</main>
          <Footer />
        </div>
      </GlobalProvider>
    </div>
  );
};

export default Layout;
