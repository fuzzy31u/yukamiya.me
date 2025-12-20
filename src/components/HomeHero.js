/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { RiArrowRightSLine } from "react-icons/ri"
import {
  RiFacebookBoxFill,
  RiTwitterFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
  RiInstagramFill,
  RiRssFill,
  RiGithubFill,
  RiTelegramFill,
  RiPinterestFill,
  RiSnapchatFill,
  RiSkypeFill,
  RiDribbbleFill,
  RiMediumFill,
  RiBehanceFill,
} from "react-icons/ri"
import { FaTiktok, FaWordpress, FaVk } from "react-icons/fa"

const iconMap = {
  facebook: RiFacebookBoxFill,
  twitter: RiTwitterFill,
  linkedin: RiLinkedinBoxFill,
  youtube: RiYoutubeFill,
  instagram: RiInstagramFill,
  rss: RiRssFill,
  github: RiGithubFill,
  telegram: RiTelegramFill,
  pinterest: RiPinterestFill,
  snapchat: RiSnapchatFill,
  skype: RiSkypeFill,
  wordpress: FaWordpress,
  tiktok: FaTiktok,
  dribbble: RiDribbbleFill,
  medium: RiMediumFill,
  behance: RiBehanceFill,
  vk: FaVk,
}

const HomeHero = ({ content, image, socialIcons }) => {
  return (
    <section className="home-hero">
      <div className="home-hero-grid grids col-1 sm-2">
        <div className="home-hero-content">
          <h1 className="home-hero-title lang-en">{content.en.title}</h1>
          <h1 className="home-hero-title lang-ja">{content.ja.title}</h1>

          <p className="home-hero-tagline lang-en">{content.en.tagline}</p>
          <p className="home-hero-tagline lang-ja">{content.ja.tagline}</p>

          <div className="home-hero-description lang-en">
            <p>{content.en.description}</p>
          </div>
          <div className="home-hero-description lang-ja">
            <p>{content.ja.description}</p>
          </div>

          <Link
            to={content.en.ctaLink}
            className="home-hero-cta button lang-en"
            sx={{
              variant: "variants.button",
            }}
          >
            {content.en.ctaText}
            <span className="icon -right">
              <RiArrowRightSLine />
            </span>
          </Link>

          <Link
            to={content.ja.ctaLink}
            className="home-hero-cta button lang-ja"
            sx={{
              variant: "variants.button",
            }}
          >
            {content.ja.ctaText}
            <span className="icon -right">
              <RiArrowRightSLine />
            </span>
          </Link>

          <div
            className="home-hero-social"
            sx={{
              variant: "variants.socialIcons",
            }}
          >
            {socialIcons.map((icons, index) => {
              const IconComponent = iconMap[icons.icon]
              if (!IconComponent) return null

              return (
                <a
                  key={`social-icon-${index}`}
                  href={icons.url}
                  target="_blank"
                  aria-label={`link to ${icons.icon}`}
                  rel="noopener noreferrer"
                >
                  <IconComponent alt={`${icons.icon} icon`} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="home-hero-image">
          {image && (
            <GatsbyImage
              image={image}
              alt="Yu Kamiya profile"
              className="featured-image"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeHero
