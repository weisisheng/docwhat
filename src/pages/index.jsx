// @format
// @flow
// @ts-ignore
// @ts-nocheck
import { graphql } from 'gatsby'
import { H3 } from 'glamorous'
import * as React from 'react'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import JsonLd from '../components/JsonLd'
import Layout from '../components/Layout'
import Link from '../components/Link'
import PostCardList from '../components/PostCardList'
import TheNet from '../components/TheNet'
import { siteTitle } from '../utils/constants'
import { blogJsonLD } from '../utils/ldjson'

// https://jsonld-examples.com/schema.org/code/blog-markup.php
const jsonLdData = {
  '@context': `http://schema.org`,
  blogJsonLD,
  //     "potentialAction": {
  // "@type": "SearchAction",
  // "target": "https://example.com/search.php?q={search_term}",
  // "query-input": "required name=search_term"
  //     },
}

const SiteIndex = (props: {
  location: Location,
  data: { posts: { edges: Array<React.Node> } },
}) => (
  <Layout location={props.location}>
    <>
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
      <PostCardList postcards={props.data.posts.edges} />
      <H3 css={{ textAlign: `right` }}>
        <Link to="/all">See all blog posts&hellip;</Link>
      </H3>
      <JsonLd data={jsonLdData} />
      <Bio />
      <TheNet />
    </>
  </Layout>
)

export default SiteIndex

export const pageQuery = graphql`
  query {
    posts: allMarkdownRemark(
      limit: 10
      sort: { order: DESC, fields: [fields___date] }
      filter: {
        fields: {
          sourceName: { eq: "posts" }
          draft: { eq: false }
          archived: { eq: false }
        }
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