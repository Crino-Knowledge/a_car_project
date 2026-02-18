const path = require('path')

const config = {
  projectName: 'auto-parts-purchase-miniapp',
  date: '2024-2-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  cache: {
    enable: false
  },
  sass: {
    data: `@import "@/styles/variables.scss";`
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain) {
      chain.resolve.alias
        .set('@', path.resolve(__dirname, '..', 'src'))
        .set('@/components', path.resolve(__dirname, '..', 'src/components'))
        .set('@/pages', path.resolve(__dirname, '..', 'src/pages'))
        .set('@/services', path.resolve(__dirname, '..', 'src/services'))
        .set('@/store', path.resolve(__dirname, '..', 'src/store'))
        .set('@/utils', path.resolve(__dirname, '..', 'src/utils'))
        .set('@/types', path.resolve(__dirname, '..', 'src/types'))
        .set('@/assets', path.resolve(__dirname, '..', 'src/assets'))
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
