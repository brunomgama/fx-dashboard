'use client';

import enTranslations from '@/locales/en.json';
import ptTranslations from '@/locales/pt.json';
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'pt';

type Translations = typeof enTranslations;

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: Translations;
}

const translations = {
	en: enTranslations,
	pt: ptTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<Language>(() => {
		if (typeof window !== 'undefined') {
			const savedLanguage = localStorage.getItem('language') as Language;
			if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
				return savedLanguage;
			}
		}
		return 'en';
	});

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem('language', lang);
	};

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				t: translations[language],
			}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
}
