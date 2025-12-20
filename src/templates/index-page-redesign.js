/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"

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

  // Get current language from body class (default to 'en')
  const getCurrentLanguage = () => {
    if (typeof document !== "undefined") {
      return document.body.classList.contains("lang-ja") ? "ja" : "en"
    }
    return "en"
  }

  const currentLanguage = getCurrentLanguage()
  const highlights = homeContent.highlights[currentLanguage]

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
