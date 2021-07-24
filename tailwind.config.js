const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
        content: ['src/**/*.html']
    },
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: colors.sky,
                secondary: colors.amber,
                gray: colors.trueGray
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