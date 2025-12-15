import React, { useState, useEffect } from 'react'

const LanguageToggle = () => {
  const [lang, setLang] = useState('ja')

  // Load saved language preference on mount (client-side only)
  useEffect(() => {
    const savedLang = localStorage.getItem('lang')
    if (savedLang && savedLang !== lang) {
      setLang(savedLang)
    }
  }, [])

  // Persist language preference and apply body class
  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.body.classList.toggle('lang-en', lang === 'en')

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('lang-en')
    }
  }, [lang])

  return (
    <div className="lang-toggle">
      <button
        className={`lang-btn ${lang === 'ja' ? 'active' : ''}`}
        onClick={() => setLang('ja')}
        aria-label="Switch to Japanese"
      >
        日本語
      </button>
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  )
}

export default LanguageToggle
