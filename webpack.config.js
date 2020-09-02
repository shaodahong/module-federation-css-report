const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const isDevelopment = process.env.NODE_ENV !== 'production';
const deps = require('./package.json').dependencies;

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    publicPath: 'http://localhost:3001/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: [require.resolve('react-refresh/babel')]
        }
      }
    ]
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js'
      },
      exposes: {
        './routes': './src/routes'
      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: deps['react-dom']
        }
      }
    })
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
