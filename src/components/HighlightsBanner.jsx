import React from 'react'
import { highlights } from '../data/about-content'

const HighlightsBanner = () => {
  // Duplicate items for seamless infinite scroll
  const duplicatedHighlights = [...highlights, ...highlights]

  return (
    <div className="highlights-banner">
      <div className="highlights-track">
        {duplicatedHighlights.map((highlight, index) => (
          <div key={index} className="highlight-item">
            <span data-lang="ja">{highlight.ja}</span>
            <span data-lang="en">{highlight.en}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HighlightsBanner
