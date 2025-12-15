import React from 'react'

const CardGrid = ({ items }) => {
  const CardContent = ({ item }) => (
    <>
      {item.featured && (
        <span className="featured-badge">
          <span data-lang="ja">注目</span>
          <span data-lang="en">Featured</span>
        </span>
      )}
      {item.year && <span className="card-year">{item.year}</span>}
      <div className="card-title">
        <span data-lang="ja">{item.title.ja}</span>
        <span data-lang="en">{item.title.en}</span>
      </div>
      {item.org && <div className="card-org">{item.org}</div>}
    </>
  )

  return (
    <div className="card-grid">
      {items.map((item, index) =>
        item.url ? (
          <a
            key={item.url || `${item.year}-${item.title.en}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`card ${item.featured ? 'featured' : ''}`}
          >
            <CardContent item={item} />
          </a>
        ) : (
          <div
            key={`${item.year}-${item.title.en}-${index}`}
            className={`card ${item.featured ? 'featured' : ''}`}
          >
            <CardContent item={item} />
          </div>
        )
      )}
    </div>
  )
}

export default CardGrid
