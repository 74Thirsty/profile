module.exports = {
  darkMode: 'class', // Enable dark mode toggle
  content: [
    "./index.html",
    "./about.html",
    "./contact.html",
    "./projects.html",
    "./**/*.js", // Add the path to your JS files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#56A0D3', // Tarheels Blue
        secondary: '#F4B6C2', // Light Pink (secondary)
        accent: '#99C5C9', // Light Blue Accent
        bgDark: '#0a192f', // Dark Background
        laser: '#FF005C', // Laser color for animation
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'laser-scan': 'laserScan 4s linear infinite',
      },
      keyframes: {
        laserScan: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
    },
  },
  plugins: [],
}
