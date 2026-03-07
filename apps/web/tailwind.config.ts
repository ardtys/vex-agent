import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				vex: {
					black: '#060606',
					white: '#f0ede6',
					lime: '#c8ff00',
					red: '#ff2d2d',
					surface: '#0f0f0f',
					border: '#1a1a1a',
					muted: '#555555'
				}
			},
			fontFamily: {
				display: ['Bebas Neue', 'sans-serif'],
				mono: ['Space Mono', 'monospace']
			},
			animation: {
				blink: 'blink 1s step-end infinite',
				ticker: 'ticker 20s linear infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'gradient-x': 'gradient-x 15s ease infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'spin-slow': 'spin 20s linear infinite',
				'bounce-slow': 'bounce 3s infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.3s ease-out'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				ticker: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				glow: {
					'0%': { boxShadow: '0 0 20px rgba(200, 255, 0, 0.3)' },
					'100%': { boxShadow: '0 0 40px rgba(200, 255, 0, 0.6)' }
				},
				'gradient-x': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			}
		}
	},
	plugins: []
} satisfies Config;
