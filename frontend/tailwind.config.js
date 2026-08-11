/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#fe5000',
                    hover: '#e04600',
                },
                secondary: '#111827',
                accent: '#3b82f6',
                dark: '#0f172a',
                light: '#ffffff',
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                },
                text: {
                    main: '#1f2937',
                    muted: '#6b7280',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
