const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-simple-vars'),
        require('tailwindcss'),
        require('autoprefixer'),
        ...(process.env.NODE_ENV == 'production'
            ? [purgecss({ content: ['./dist/**/*.html'] })]
            : []),
    ],
};
