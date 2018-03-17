import g, { H3, Small, Div } from 'glamorous'
import React from 'react'
import PropTypes from "prop-types"
import Link from 'gatsby-link'
import { rhythm } from '../utils/typography'

const Title = props => (
  <H3 css={{
    marginBottom: 0,
  }} >
    <Link style={{ boxShadow: 'none' }} to={props.to}>
      {props.children}
    </Link>
  </H3>
)

const Meta = props => (
  <Small css={{
    display: 'block',
    lineHeight: 1,
    marginBottom: rhythm(1 / 4),
    textAlign: 'right',
  }} >
    {props.children}
  </Small>
)

const PostCard = props => {
  const {
    slug,
    title,
    date,
    excerpt
  } = props

  return (
    <section>
      <Title to={slug}>{title}</Title>
      <Meta>{date}</Meta>
      <p dangerouslySetInnerHTML={{ __html: excerpt }} />
    </section>
  )
}

PostCard.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
}

export default PostCard

export const query = graphql`
fragment postCardFragment on MarkdownRemark {
  fields {
    slug
    title
    date(formatString: "MMMM DD, YYYY")
  }
  excerpt(pruneLength: 280)
}
`
