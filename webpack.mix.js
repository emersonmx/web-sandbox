const mix = require('laravel-mix');

const purgecss = require('@fullhuman/postcss-purgecss');

mix.disableNotifications();
mix.setPublicPath('dist');

mix.js('src/app/main.js', 'dist/app');
mix.postCss('src/app/main.css', 'dist/app', [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('tailwindcss'),
    require('autoprefixer'),
    purgecss({
        content: ['./dist/**/*.html'],
    }),
]);

if (mix.inProduction()) {
    mix.version();
}
