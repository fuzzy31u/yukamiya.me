import React from 'react'

const AboutHero = () => {
  return (
    <div className="about-hero animate-in">
      <div className="hero-content">
        <h1>
          <span data-lang="ja">神谷 優</span>
          <span data-lang="en">Yu Kamiya</span>
        </h1>
        <p className="subtitle">
          <span data-lang="ja">ソフトウェアエンジニア / Tech DE&I リード</span>
          <span data-lang="en">Software Engineer / Tech DE&I Lead</span>
        </p>
        <p className="intro" data-lang="ja">
          サイバーエージェントにてソフトウェアエンジニアとして、子ども向けプログラミング学習サービス「QUREO」の開発に携わる傍ら、IT業界のジェンダーギャップ解消を目指す「Tech DE&Iプロジェクト」をリードしています。
        </p>
        <p className="intro" data-lang="en">
          At CyberAgent, I work as a software engineer developing "QUREO," a programming education service for children, while leading the "Tech DE&I Project" aimed at eliminating gender gaps in the IT industry.
        </p>
      </div>
      <div className="hero-image">
        <img src="/assets/site_profile_1.jpg" alt="Yu Kamiya" />
      </div>
    </div>
  )
}

export default AboutHero
