import React, { useState, useEffect } from 'react'

const LanguageToggle = () => {
  const [lang, setLang] = useState('ja')

  useEffect(() => {
    // Apply language class to body
    document.body.classList.toggle('lang-en', lang === 'en')
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
