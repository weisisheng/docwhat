// @format
// @flow
import { H3, Div } from 'glamorous'
import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { siteTitle } from '../utils/constants'
import { rhythm } from '../utils/typography'
import { blogJsonLD } from '../utils/ldjson'

import Bio from '../components/Bio'
import PostCard from '../components/PostCard'
import TheNetwork from '../components/TheNetwork'
import Link from '../components/Link'

// https://jsonld-examples.com/schema.org/code/blog-markup.php
const BlogMicroData = () => {
  const jsonObject = {
    '@context': `http://schema.org`,
    blogJsonLD,
    //     "potentialAction": {
    // "@type": "SearchAction",
    // "target": "https://example.com/search.php?q={search_term}",
    // "query-input": "required name=search_term"
    //     },
  }

  return (
    <script type="application/ld+json">{JSON.stringify(jsonObject)}</script>
  )
}

const SiteIndex = props => (
  <Div>
    <Helmet title={siteTitle}>
      <meta
        name="google-site-verification"
        content="caPZYkV8gUY3XzcNO0khNKflZYZvmpYNAYl280tdzn4"
      />
      <link
        rel="openid2.provider"
        href="https://openid.stackexchange.com/openid/provider"
      />
      <link
        rel="openid2.local_id"
        href="https://openid.stackexchange.com/user/073b6f81-f2a1-4242-8975-3d951089be48"
      />
      <link
        rel="openid.server"
        href="https://openid.stackexchange.com/openid/provider"
      />
      <link
        rel="openid.delegate"
        href="https://openid.stackexchange.com/user/073b6f81-f2a1-4242-8975-3d951089be48"
      />
      <meta
        httpEquiv="X-XRDS-Location"
        content="https://openid.stackexchange.com/xrds"
      />
      <meta
        httpEquiv="X-Yadis-Location"
        content="https://openid.stackexchange.com/xrds"
      />
    </Helmet>
    <Div
      css={{
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `wrap`,
        margin: rhythm(-1 / 2),
        '&>*': {
          margin: rhythm(1 / 2),
        },
      }}
    >
      {props.data.posts.edges.map(({ node }) => {
        const { fields: { title, slug, date }, excerpt } = node

        return (
          <PostCard
            overrideCss={{
              flex: `1 1 ${rhythm(10)}`,
              '&>p': {
                textAlign: `justify`,
              },
            }}
            key={slug}
            slug={slug}
            title={title}
            date={date}
            excerpt={excerpt}
          />
        )
      })}
    </Div>
    <H3 css={{ textAlign: `right` }}>
      <Link to="/all">See all blog posts&hellip;</Link>
    </H3>
    <BlogMicroData />
    <Bio />
    <TheNetwork />
  </Div>
)

SiteIndex.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.shape({
      edges: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
}

export default SiteIndex

export const pageQuery = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(
      limit: 10
      sort: { fields: [fields___date], order: DESC }
      filter: {
        fields: { template: { eq: "post" } }
        frontmatter: { test: { ne: true }, archive: { ne: true } }
      }
    ) {
      edges {
        node {
          ...postCardFragment
        }
      }
    }
  }
`
