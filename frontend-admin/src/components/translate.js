import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export const useDashboardText = () => {
  const { language } = useContext(LanguageContext);

  const [uiText, setUiText] = useState({
    title: "Administrator Dashboard",
    heading: "Operation Honey Badger: ",
    subheading:"Admin Dashboard", 
    searchPlaceholder: "Search Dashboard...",
    commonExploitsTitle: "Common Exploits",
    loading: "Loading...",
    recentReports: "Recent Reports",
    reportsLoading: "Loading number of reports generated...",
    attackerEngagement: "Attacker Engagement",
    endpointsTargeted: "Endpoints Targeted",
    browsersUsed: "Browsers Used",
    attackerIP: "Attacker IP",
    attackerOS: "Attacker OS",
    attackerGeo: "Attacker Geolocation",
    refresh: "Refresh",
    refreshLoading: "Refreshing...",
    countries: "Top 5 Countries:"
  });

  useEffect(() => {
    const translateUIText = async () => {
      const keys = Object.keys(uiText);
      const values = Object.values(uiText);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: values, targetLanguage: language })
        });

        const data = await response.json();
        if (data.translations) {
          const translated = {};
          keys.forEach((key, idx) => {
            translated[key] = data.translations[idx].translatedText;
          });
          setUiText(translated);
        }
      } catch (err) {
        console.error('Translation error:', err);
      }
    };

    translateUIText();
  }, [language]);

  return uiText;
};