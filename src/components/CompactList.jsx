import React from 'react'

const CompactList = ({ items }) => {
  return (
    <div className="compact-list">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="list-item"
        >
          {item.icon && <div className="item-icon">{item.icon}</div>}
          <div className="item-content">
            <div className="item-title">
              <span data-lang="ja">{item.title.ja}</span>
              <span data-lang="en">{item.title.en}</span>
            </div>
            <div className="item-meta">
              {item.venue && <span>{item.venue} • </span>}
              {item.year && <span>{item.year}</span>}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default CompactList
