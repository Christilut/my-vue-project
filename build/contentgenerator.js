const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const YAML_FRONTMATTER_REGEX = /^(\s*\-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)\-{3})?([\w\W]*)*/

const CWD = path.join(__dirname, '..')

const contentFiles = fs.readdirSync(path.join(CWD, 'content'))
const contentTypes = []
const result = {
  content: []
}

for (const filename of contentFiles) {
  const isDir = fs.statSync(path.join(CWD, 'content', filename)).isDirectory()

  if (isDir) {
    contentTypes.push(filename)
  }
}

for (const contentType of contentTypes) {
  const folderpath = path.join(CWD, 'content', contentType)

  const files = fs.readdirSync(folderpath)

  const contentResult = {
    type: contentType,
    items: []
  }

  for (const filename of files) {
    const isMarkdown = path.extname(filename) === '.md'

    if (isMarkdown) {
      const fileContents = fs.readFileSync(path.join(folderpath, filename))

      const fileParsed = YAML_FRONTMATTER_REGEX.exec(fileContents)

      let frontmatter = fileParsed[1]
      frontmatter = frontmatter.replace(/^\s*\-{3}/, '')
      frontmatter = frontmatter.replace(/\-{3}$/, '')

      const frontmatterJson = yaml.safeLoad(frontmatter)

      contentResult.items.push({
        filename: filename,
        filenameClean: filename.replace('.md', ''),
        frontmatter: frontmatterJson,
        body: fileParsed[3]
      })
    }
  }

  result.content.push(contentResult)
}

fs.writeFileSync(path.join(CWD, 'content', 'content.json'), JSON.stringify(result, null, '  '))

