/** @jsx jsx */
import { jsx } from "theme-ui"
import { useEffect, useState } from "react"

const LanguageToggle = () => {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Get saved language from localStorage or default to 'en'
    const savedLanguage = typeof window !== "undefined"
      ? localStorage.getItem("language") || "en"
      : "en"
    setLanguage(savedLanguage)
    if (typeof document !== "undefined") {
      document.body.className = document.body.className.replace(/lang-\w+/, "") + ` lang-${savedLanguage}`
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ja" : "en"
    setLanguage(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)
    }
    if (typeof document !== "undefined") {
      document.body.className = document.body.className.replace(/lang-\w+/, "") + ` lang-${newLanguage}`
    }
  }

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
      aria-label={`Switch to ${language === "en" ? "Japanese" : "English"}`}
      sx={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        padding: "8px 16px",
        borderRadius: "20px",
        border: "2px solid",
        borderColor: "primary",
        backgroundColor: "background",
        color: "text",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "primary",
          color: "background",
          transform: "scale(1.05)"
        }
      }}
    >
      {language === "en" ? "日本語" : "English"}
    </button>
  )
}

export default LanguageToggle
