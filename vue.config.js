module.exports = {
  devServer: {
    proxy: {
      '^/': {
        target: 'http://api.lidaxian.cn',
          // pathRewrite: {
          //     '/api': '/api'
          //   },
        changeOrigin: true
      },

    }
  },
  publicPath:'./'
}