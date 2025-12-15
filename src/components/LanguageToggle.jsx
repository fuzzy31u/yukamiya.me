import React, { useState, useEffect } from 'react'

const LanguageToggle = () => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'ja'
    }
    return 'ja'
  })

  useEffect(() => {
    // Persist language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang)
    }
    // Apply language class to body
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
