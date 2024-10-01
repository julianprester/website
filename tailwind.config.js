import { sky, amber, neutral } from 'tailwindcss/colors'
import { screens as _screens } from 'tailwindcss/defaultTheme'

export const content = [
    'src/**/*.html',
    'src/**/*.md',
    '.eleventy.js'
]
export const darkMode = 'class'
export const theme = {
    screens: {
        'xs': '475px',
        ..._screens,
    },
    extend: {
        colors: {
            primary: sky,
            secondary: amber,
            gray: neutral
        },
    },
    fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'avenir next', 'avenir', 'segoe ui', 'helvetica neue', 'helvetica', 'Ubuntu', 'roboto', 'noto', 'arial', 'sans-serif'],
        'serif': ['Iowan Old Style', 'Apple Garamond', 'Baskerville', 'Times New Roman', 'Droid Serif', 'Times', 'Source Serif Pro', 'serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
        'mono': ['Menlo', 'Consolas', 'Monaco', 'Liberation Mono', 'Lucida Console', 'monospace'],
    },
}
export const variants = {
    extend: {
        scale: ['group-hover']
    }
}
export const plugins = []