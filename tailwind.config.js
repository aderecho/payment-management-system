import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Existing Custom Green
                'custom-green-dark': {
                    DEFAULT: '#00573F', 
                    'hover': '#00402E',
                },
                
                // New Custom Color: #8A1538 (Maroon)
                'brand-maroon': {
                    DEFAULT: '#8A1538',
                    'hover': '#6E112D', // Slightly darker for hover
                },
                
                // New Custom Color: #FFB81C (Gold/Yellow)
                'brand-gold': {
                    DEFAULT: '#FFB81C',
                    'hover': '#CC9316', // Slightly darker for hover
                },
            },
        },
    },

    plugins: [forms],
};