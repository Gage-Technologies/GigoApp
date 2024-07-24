import React, {createContext, useState, useContext} from 'react';

type LanguageContextType = {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC = ({children}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  return (
    <LanguageContext.Provider value={{selectedLanguage, setSelectedLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
