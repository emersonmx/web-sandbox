const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-simple-vars'),
        require('tailwindcss'),
        require('autoprefixer'),
        purgecss({
            content: ['./dist/**/*.html'],
        }),
    ],
};
