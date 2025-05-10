const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: ['webpack/hot/poll?100'],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    module: {
        rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
};
