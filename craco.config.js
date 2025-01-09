/* craco.config.js */
const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: {
                        '@primary-color': '#475941',
                        '@hover-color': '#e2d9b1',
                        '@second-color': '#9ac5a1',
                        '@second-hover-color': '#e2d9b1',
                    },
                    javascriptEnabled: true,
                },
            },
        },
    }, ],
    webpack: {
        alias: {
            "@": path.resolve("src"),
            "@utils": path.resolve("src/utils"),
            '@pages': path.resolve('src/pages'),
            '@common': path.resolve('src/common'),
            '@components': path.resolve('src/components'),
            '@features': path.resolve('src/features'),
            '@mock': path.resolve('src/__MOCK__'),
            '@data': path.resolve('src/data'),
        }
    },
};