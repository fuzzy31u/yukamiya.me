import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import AboutHero from "../components/AboutHero"
import HighlightsBanner from "../components/HighlightsBanner"
import CardGrid from "../components/CardGrid"
import CompactList from "../components/CompactList"
import TimelineSection from "../components/TimelineSection"

import { awards, certifications, organizedEvents, research, writing, media, podcasts, links } from "../data/about-content"
import "../assets/scss/about.scss"

export const pageQuery = graphql`
  query AboutRedesignQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
  }
`

const AboutPageRedesign = ({ data }) => {
  const { markdownRemark } = data
  const { frontmatter, excerpt } = markdownRemark

  return (
    <Layout className="page">
      <Seo title={frontmatter.title} description={excerpt} />
      <div className="about-page-redesign">
        <div className="container">
          <AboutHero />
        </div>

        <HighlightsBanner />

        {/* Awards Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">受賞 / Awards</span>
            <span data-lang="en">Awards</span>
          </h2>
          <CardGrid items={awards} />
        </section>

        {/* Certifications Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">資格 / Certifications</span>
            <span data-lang="en">Certifications</span>
          </h2>
          <div className="certifications-list">
            {certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="certification-item"
              >
                <span data-lang="ja">{cert.title.ja}</span>
                <span data-lang="en">{cert.title.en}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Speaking Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">登壇 / Public Speaking</span>
            <span data-lang="en">Public Speaking</span>
          </h2>
          <TimelineSection />
        </section>

        {/* Organized Events Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">主催イベント / Organized Events</span>
            <span data-lang="en">Organized Events</span>
          </h2>
          <CardGrid items={organizedEvents} />
        </section>

        {/* Research Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">論文 / Research</span>
            <span data-lang="en">Research</span>
          </h2>
          <CompactList items={research} />
        </section>

        {/* Writing Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">執筆 / Writing</span>
            <span data-lang="en">Writing</span>
          </h2>
          <CompactList items={writing} />
        </section>

        {/* Media Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">掲載 / Media</span>
            <span data-lang="en">Media</span>
          </h2>
          <CompactList items={media} />
        </section>

        {/* Podcast Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">ポッドキャスト / Podcasts</span>
            <span data-lang="en">Podcasts</span>
          </h2>
          <CardGrid items={podcasts} />
        </section>

        {/* Links Section */}
        <section className="links-section">
          <h2>
            <span data-lang="ja">リンク / Links</span>
            <span data-lang="en">Links</span>
          </h2>
          <div className="links-grid">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card"
              >
                <div className="link-icon">
                  {/* Simple icon placeholder - can be replaced with actual SVG icons */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="16" r="14" opacity="0.3"/>
                    <text x="16" y="20" textAnchor="middle" fontSize="16" fill="currentColor">
                      {link.icon === 'hatena' && 'B'}
                      {link.icon === 'qiita' && 'Q'}
                      {link.icon === 'speakerdeck' && 'S'}
                      {link.icon === 'zenn' && 'Z'}
                    </text>
                  </svg>
                </div>
                <div className="link-name">
                  <span data-lang="ja">{link.name.ja}</span>
                  <span data-lang="en">{link.name.en}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default AboutPageRedesign
