/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "#FAFAFC",
                foreground: "#0F172A",
                primary: {
                    DEFAULT: '#FF6B00',
                    hover: '#E05D00',
                    glow: '#FF8800',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#FF9900',
                    foreground: '#FFFFFF',
                },
                sunrise: {
                    bg: '#FAFAFC',
                    card: '#FFFFFF',
                    border: 'rgba(255, 107, 0, 0.15)',
                    light: '#FFF7F0',
                    orange: '#FF6B00',
                    amber: '#FF9900',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Sora', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'sunrise-card': '0 20px 40px -15px rgba(255, 107, 0, 0.08), 0 0 1px rgba(0,0,0,0.05)',
                'sunrise-orange': '0 10px 25px -5px rgba(255, 107, 0, 0.3)',
                'sunrise-glow': '0 0 30px -5px rgba(255, 107, 0, 0.25)',
            },
        },
    },
    plugins: [],
}
