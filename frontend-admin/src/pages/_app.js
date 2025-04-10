import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";
import { LanguageProvider } from '@/context/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <FontProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </FontProvider>
  );
}
