/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"
import { useState, useEffect } from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import LanguageToggle from "../components/LanguageToggle"
import HomeHero from "../components/HomeHero"
import HighlightsBanner from "../components/HighlightsBanner"
import homeContent from "../data/home-content"
import Icons from "../util/socialmedia.json"
import "../assets/scss/home.scss"

export const pageQuery = graphql`
  query HomeRedesignQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        tagline
        featuredImage {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, width: 585, height: 439)
          }
        }
      }
    }
  }
`

const IndexPageRedesign = ({ data }) => {
  const { markdownRemark } = data
  const { frontmatter } = markdownRemark
  const Image = frontmatter.featuredImage
    ? frontmatter.featuredImage.childImageSharp.gatsbyImageData
    : null

  // Track current language with state
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    // Listen for language change events
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("languageChange", handleLanguageChange)

      // Set initial language from localStorage
      const savedLanguage = localStorage.getItem("language") || "en"
      setCurrentLanguage(savedLanguage)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("languageChange", handleLanguageChange)
      }
    }
  }, [])

  const highlights = homeContent.highlights?.[currentLanguage] || homeContent.highlights?.en || []

  return (
    <Layout>
      <Seo title={frontmatter.title} />
      <LanguageToggle />
      <HomeHero
        content={homeContent.hero}
        image={Image}
        socialIcons={Icons.socialIcons}
      />
      <HighlightsBanner highlights={highlights} />
    </Layout>
  )
}

export default IndexPageRedesign
