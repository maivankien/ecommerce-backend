const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, 'tsconfig.json')
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
    }
}
