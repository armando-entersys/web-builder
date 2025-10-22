/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('@relume_io/relume-tailwind')],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--color-border))',
  			input: 'hsl(var(--color-input))',
  			ring: 'hsl(var(--color-ring))',
  			background: 'hsl(var(--color-background))',
  			foreground: 'hsl(var(--color-foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--color-primary))',
  				foreground: 'hsl(var(--color-primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--color-secondary))',
  				foreground: 'hsl(var(--color-secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--color-destructive))',
  				foreground: 'hsl(var(--color-destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--color-muted))',
  				foreground: 'hsl(var(--color-muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--color-accent))',
  				foreground: 'hsl(var(--color-accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--color-popover))',
  				foreground: 'hsl(var(--color-popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--color-card))',
  				foreground: 'hsl(var(--color-card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius-lg)',
  			md: 'var(--radius-md)',
  			sm: 'var(--radius-sm)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			gradient: {
  				to: {
  					backgroundPosition: 'var(--bg-size) 0'
  				}
  			},
  			flip: {
  				'0%': {
  					transform: 'rotateX(0deg)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'rotateX(90deg)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'rotateX(0deg)',
  					opacity: '1'
  				}
  			},
  			'shimmer-slide': {
  				to: {
  					transform: 'translate(calc(100cqw - 100%), 0)'
  				}
  			},
  			'spin-around': {
  				'0%': {
  					transform: 'translateZ(0) rotate(0)'
  				},
  				'15%, 35%': {
  					transform: 'translateZ(0) rotate(90deg)'
  				},
  				'65%, 85%': {
  					transform: 'translateZ(0) rotate(270deg)'
  				},
  				'100%': {
  					transform: 'translateZ(0) rotate(360deg)'
  				}
  			},
  			meteor: {
  				'0%': {
  					transform: 'rotate(215deg) translateX(0)',
  					opacity: '1'
  				},
  				'70%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'rotate(215deg) translateX(-500px)',
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			gradient: 'gradient 8s linear infinite',
  			flip: 'flip 0.5s ease-in-out',
  			'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
  			'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
  			meteor: 'meteor 5s linear infinite'
  		}
  	}
  },
  plugins: [],
}
