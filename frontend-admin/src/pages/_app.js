import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";

export default function App({ Component, pageProps }) {
  return (
    <FontProvider>
      <Component {...pageProps} />
    </FontProvider>
  );
}
