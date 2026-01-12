import React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import CardGrid from "../components/CardGrid"
import CompactList from "../components/CompactList"
import TimelineSection from "../components/TimelineSection"

import { awards, certifications, organizedEvents, research, writing, media, podcasts, links, workHistory, education } from "../data/about-content"
import "../assets/scss/about.scss"

const AboutPageRedesign = ({ pageContext }) => {
  const { title } = pageContext

  return (
    <Layout className="page">
      <Seo
        title={title}
        description="Software engineer Yu Kamiya's about page - awards, speaking engagements, publications, and career history."
      />
      <div className="about-page-redesign">
        {/* Awards Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">受賞</span>
            <span data-lang="en">Awards</span>
          </h2>
          <CardGrid items={awards} />
        </section>

        {/* Certifications Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">資格</span>
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
            <span data-lang="ja">登壇</span>
            <span data-lang="en">Public Speaking</span>
          </h2>
          <TimelineSection />
        </section>

        {/* Organized Events Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">主催イベント</span>
            <span data-lang="en">Organized Events</span>
          </h2>
          <CardGrid items={organizedEvents} />
        </section>

        {/* Research Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">論文</span>
            <span data-lang="en">Research</span>
          </h2>
          <CompactList items={research} />
        </section>

        {/* Writing Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">執筆</span>
            <span data-lang="en">Writing</span>
          </h2>
          <CompactList items={writing} />
        </section>

        {/* Media Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">掲載</span>
            <span data-lang="en">Media</span>
          </h2>
          <CompactList items={media} />
        </section>

        {/* Podcast Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">ポッドキャスト</span>
            <span data-lang="en">Podcasts</span>
          </h2>
          <CardGrid items={podcasts} />
        </section>

        {/* Work History Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">職歴</span>
            <span data-lang="en">Work History</span>
          </h2>
          <div className="work-history-list">
            {workHistory.map((job, index) => (
              <div key={index} className="work-history-item">
                <span className="work-period">
                  <span data-lang="ja">{job.period}</span>
                  <span data-lang="en">{job.periodEn}</span>
                </span>
                <span className="work-title">
                  <span data-lang="ja">{job.title.ja}</span>
                  <span data-lang="en">{job.title.en}</span>
                </span>
                <span className="work-company">@ {job.company}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="about-section">
          <h2>
            <span data-lang="ja">学歴</span>
            <span data-lang="en">Education</span>
          </h2>
          <div className="education-list">
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <span className="edu-period">{edu.period}</span>
                <span className="edu-degree">
                  <span data-lang="ja">{edu.degree.ja}</span>
                  <span data-lang="en">{edu.degree.en}</span>
                </span>
                <span className="edu-field">
                  <span data-lang="ja">{edu.field.ja}</span>
                  <span data-lang="en">{edu.field.en}</span>
                </span>
                <span className="edu-school">
                  <span data-lang="ja">{edu.school.ja}</span>
                  <span data-lang="en">{edu.school.en}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Links Section */}
        <section className="links-section">
          <h2>
            <span data-lang="ja">リンク</span>
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
