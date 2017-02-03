<template lang="pug">
div
  h2 Blog
  .post(v-for='post in posts')
    h4 {{ post.frontmatter.title }}
    div(v-html='post.body')
</template>

<script>
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    const contentFile = require('../../../content/content.json')

    this.posts = contentFile.content.find(x => x.type === 'blogposts').items

    console.log(this.posts)
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variables.scss';
</style>
