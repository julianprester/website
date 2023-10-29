const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        'src/**/*.html',
        'src/**/*.md',
        '.eleventy.js'
    ],
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
        },
        extend: {
            colors: {
                primary: colors.sky,
                secondary: colors.amber,
                gray: colors.neutral
            },
        },
        fontFamily: {
            'sans': ['-apple-system', 'BlinkMacSystemFont', 'avenir next', 'avenir', 'segoe ui', 'helvetica neue', 'helvetica', 'Ubuntu', 'roboto', 'noto', 'arial', 'sans-serif'],
            'serif': ['Iowan Old Style', 'Apple Garamond', 'Baskerville', 'Times New Roman', 'Droid Serif', 'Times', 'Source Serif Pro', 'serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
            'mono': ['Menlo', 'Consolas', 'Monaco', 'Liberation Mono', 'Lucida Console', 'monospace'],
        },
    },
    variants: {
        extend: {
            scale: ['group-hover']
        }
    },
    plugins: [],
}