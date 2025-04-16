import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";
import { LanguageProvider } from '@/context/LanguageContext';
import { TextSizeProvider } from "@/context/TextSizeContext";

export default function App({ Component, pageProps }) {
  return (
    <FontProvider>
      <LanguageProvider>
        <TextSizeProvider>
          <Component {...pageProps} />
        </TextSizeProvider>
      </LanguageProvider>
    </FontProvider>
  );
}
