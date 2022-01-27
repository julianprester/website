const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        'src/**/*.html',
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
            'sans': ['Helvetica', 'Arial', 'sans-serif'],
            'mono': ['PT Mono', 'monospace'],
        },
    },
    variants: {
        extend: {
            scale: ['group-hover']
        }
    },
    plugins: [],
}