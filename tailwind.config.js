/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f4ea',
                    100: '#c0e4c6',
                    200: '#97d7a0',
                    300: '#6fc97b',
                    400: '#4ab95c',
                    500: '#2ca83e',
                    600: '#228a33',
                    700: '#196b27',
                    800: '#0f4c1b',
                    900: '#07300f'
                },
                accent: '#ffffff'
            },
            fontFamily: {
                sans: ['"Poppins"', 'ui-sans-serif', 'system-ui'],
                heading: ['"Poppins"', 'ui-sans-serif', 'system-ui']
            }
        }
    },
    plugins: [],
};
