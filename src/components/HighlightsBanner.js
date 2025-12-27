/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { highlights as aboutHighlights } from "../data/about-content"

const HighlightsBanner = ({ highlights }) => {
  // Use passed highlights (index page with {icon, text}) or import from about-content (about page with {ja, en})
  const useAboutFormat = !highlights
  const highlightsData = highlights || aboutHighlights

  // Return null if no highlights available
  if (!highlightsData || !Array.isArray(highlightsData) || highlightsData.length === 0) {
    return null
  }

  // Duplicate items for infinite scroll effect
  const duplicatedHighlights = [...highlightsData, ...highlightsData]

  return (
    <section className="highlights-banner">
      <div className="highlights-scroll">
        <div className="highlights-track">
          {duplicatedHighlights.map((highlight, index) => (
            <div key={`highlight-${index}`} className="highlight-item">
              {useAboutFormat ? (
                // About page format: bilingual with CSS switching
                <>
                  <span data-lang="ja">{highlight.ja}</span>
                  <span data-lang="en">{highlight.en}</span>
                </>
              ) : (
                // Index page format: icon + text
                <>
                  <span className="highlight-icon">{highlight.icon}</span>
                  <span className="highlight-text">{highlight.text}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HighlightsBanner
