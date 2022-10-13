import "../styles/globals.css";
import Layout from "../components/Layout";
import { H } from "highlight.run";

H.init("3ejn3vgp");

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
export { reportWebVitals } from "next-axiom";
