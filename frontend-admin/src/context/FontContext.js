import { createContext, useState, useEffect } from 'react';

export const FontContext = createContext();

export const FontProvider = ({children}) => {
    const [useOpenDyslexic, setUseOpenDyslexic] = useState(false);

    useEffect(() => {
        const savedFont = localStorage.getItem('fontPreference');
        if (savedFont !== null) {
            setUseOpenDyslexic(savedFont === 'true');
        }
    }, []);

    const toggleFont = (newValue) => {
        setUseOpenDyslexic(newValue);
        localStorage.setItem('fontPreference', String(newValue));
    };

    return (<FontContext.Provider value = {
                {
                    useOpenDyslexic,
                    toggleFont
                }
            }> {children} </FontContext.Provider>); };