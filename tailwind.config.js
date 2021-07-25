const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
        content: ['src/**/*.html'],
        safelist: [
            'rounded-lg',
            'shadow-lg',
        ]
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