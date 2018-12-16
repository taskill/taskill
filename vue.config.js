module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
        @import "@/assets/scss/_variables.scss";
        @import "@/assets/scss/_mixins.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')
  }
}
