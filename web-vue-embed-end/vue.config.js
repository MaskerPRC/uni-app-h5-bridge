const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/openBeta/user/stuLogin': {
        target: 'http://127.0.0.1:8082', // 代理目标地址
        pathRewrite: {
          '^/openBeta/user/stuLogin': '/openBeta/user/stuLogin' // 将/api替换为空字符串，将请求转发到http://localhost:3000
        }
      }
    }
  }
})
