// @format

const pathlib = require(`path`)
const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const onCreateNode = ({ node, actions, getNode }) => {
  try {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
      const sourceName = getNode(node.parent).sourceInstanceName

      createNodeField({ node, name: `sourceName`, value: sourceName })
      if (sourceName === `comments`) {
        createNodeField({
          node,
          name: `postSlug`,
          value: replacePath(node.frontmatter.slug),
        })
        return
      }

      const slug = calculateSlug(node, getNode)

      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
      createNodeField({
        node,
        name: `title`,
        value: calculateTitle(node, getNode),
      })
      if (sourceName === 'posts') {
        const archived =
          _.get(node, 'frontmatter.archive', false) ||
          _.get(node, 'frontmatter.archived', false)
        createNodeField({
          node,
          name: `archived`,
          value: archived,
        })
        const draft = _.get(node, `frontmatter.draft`, false)
        createNodeField({
          node,
          name: `draft`,
          value: draft,
        })
      }
      if (sourceName !== 'pages') {
        createNodeField({
          node,
          name: `date`,
          value: calculateDate(node, getNode, sourceName),
        })
      }
    }
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(`Error onCreateNode():`, node.fileAbsolutePath, `\n`, ex)
    throw ex
  }
}

const calculateTitle = (node, getNode) =>
  node.frontmatter.title ||
  getNode(node.parent)
    .name.replace(/.*\/([^/]+)$/, '$1')
    .replace(/[\d]{4}-[\d]{2}-[\d]{2}-/, '')

/**
 * Calculates the date for a post based on frontmatter and filename.
 */
const calculateDate = (node, getNode, sourceName) => {
  if (node.frontmatter.date) {
    return node.frontmatter.date
  }

  const relPath = createFilePath({
    node,
    getNode,
    basePath: `content/${sourceName}`,
  })

  const hasDateInPath = relPath.match(/^\/?([\d]{4}-[\d]{2}-[\d]{2})/)
  if (hasDateInPath) {
    return hasDateInPath[1]
  }

  throw new Error(`Unable to get date for ${relPath}`)
}

const calculateSlugFromPath = (node, getNode) => {
  const parent = getNode(node.parent)
  const name = parent.name
  const meaningfulName = name === 'index' ? pathlib.basename(parent.dir) : name

  return meaningfulName
    .replace(/.*\/([^/]+)$/, '$1')
    .replace(/[\d]{4}-[\d]{2}-[\d]{2}-/, '')
}

const calculateSlug = (node, getNode) => {
  const baseSlug = replacePath(
    node.frontmatter.slug || calculateSlugFromPath(node, getNode)
  )

  if (node.fields.sourceName === 'pies') {
    return `/pi${baseSlug}`
  }

  return baseSlug
}
const replacePath = _path =>
  _path === `/` ? _path : `/${_path.replace(/^\/|\/$/, '')}`

module.exports = onCreateNode