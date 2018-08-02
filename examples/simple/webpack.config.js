const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: { loader: 'html-loader' },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new HardSourceWebpackPlugin(),
    ],
    resolve: {
        alias: {
            'ra-tree-core': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-core',
                'src'
            ),
            'ra-tree-ui-materialui': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-ui-materialui',
                'src'
            ),
        },
    },
    devServer: {
        stats: {
            children: false,
            chunks: false,
            modules: false,
        },
    },
};
