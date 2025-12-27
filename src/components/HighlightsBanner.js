/** @jsx jsx */
import { jsx } from "theme-ui"

const HighlightsBanner = ({ highlights }) => {
  // Duplicate items for infinite scroll effect
  const duplicatedHighlights = [...highlights, ...highlights]

  return (
    <section className="highlights-banner">
      <div className="highlights-scroll">
        <div className="highlights-track">
          {duplicatedHighlights.map((highlight, index) => (
            <div key={`highlight-${index}`} className="highlight-item">
              <span className="highlight-icon">{highlight.icon}</span>
              <span className="highlight-text">{highlight.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HighlightsBanner
