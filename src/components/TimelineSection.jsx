import React, { useState } from 'react'
import { speaking } from '../data/about-content'

const TimelineSection = () => {
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filters = [
    { value: 'all', label: { ja: 'すべて', en: 'All' } },
    { value: '2025', label: { ja: '2025', en: '2025' } },
    { value: '2024', label: { ja: '2024', en: '2024' } },
    { value: '2023', label: { ja: '2023', en: '2023' } },
    { value: 'older', label: { ja: 'それ以前', en: 'Earlier' } },
  ]

  const filterItems = (items) => {
    if (filter === 'all') return items
    if (filter === 'older') {
      return items.filter(item => parseInt(item.year) < 2023)
    }
    return items.filter(item => item.year === filter)
  }

  const filteredItems = filterItems(speaking)
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 10)

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setShowAll(false)
  }

  return (
    <div className="timeline-section">
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.value}
            className={filter === f.value ? 'active' : ''}
            onClick={() => handleFilterChange(f.value)}
            data-filter={f.value}
          >
            <span data-lang="ja">{f.label.ja}</span>
            <span data-lang="en">{f.label.en}</span>
          </button>
        ))}
      </div>

      <div className="timeline">
        {displayedItems.map((item, index) => {
          const dateStr = item.month !== '00' ? `${item.year}/${item.month}` : item.year
          return (
            <div
              key={index}
              className="timeline-item"
              data-year={item.year}
            >
              <div className="timeline-date">{dateStr}</div>
              <div className="timeline-content">
                <div className="timeline-title">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <span data-lang="ja">{item.title.ja}</span>
                      <span data-lang="en">{item.title.en}</span>
                    </a>
                  ) : (
                    <>
                      <span data-lang="ja">{item.title.ja}</span>
                      <span data-lang="en">{item.title.en}</span>
                    </>
                  )}
                </div>
                <div className="timeline-venue">{item.venue}</div>
                {item.role && (
                  <span className="timeline-role">{item.role}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredItems.length > 10 && !showAll && (
        <button
          className="show-more-btn"
          onClick={() => setShowAll(true)}
        >
          <span data-lang="ja">もっと見る</span>
          <span data-lang="en">Show More</span>
        </button>
      )}
    </div>
  )
}

export default TimelineSection
