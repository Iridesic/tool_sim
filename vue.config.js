const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig(
  {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        hot: false,
        liveReload: false,
      }
    }
  },
  transpileDependencies: true,
  chainWebpack:(config)=>{
    config.module.rule('eslint').exclude.add(/node_modules/)
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
}
)
