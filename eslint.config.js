// eslint.config.js - Final Fix using Object.assign() for Merging

import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue'; 
import prettierConfig from 'eslint-config-prettier';

// 1. Define the core Vue config objects provided by the plugin
const vueFlatBase = vuePlugin.configs['flat/base'];
const vueFlatEssential = vuePlugin.configs['flat/vue3-essential'];
const vueFlatRecommended = vuePlugin.configs['flat/vue3-recommended'];

// 2. Combine the Vue configurations into a single object
//    Object.assign will safely merge the properties (like 'rules') from each config
const combinedVueConfig = Object.assign(
    {}, 
    vueFlatBase, 
    vueFlatEssential, 
    vueFlatRecommended
);

export default [
    // 1. Base Configuration (Applies to all files)
    {
        ...js.configs.recommended,

        languageOptions: {
            globals: {
                window: true,
                document: true,
                browser: true,
                node: true,
            },
        },
        rules: {
            'no-irregular-whitespace': 'error',
            'no-unused-vars': 'warn', 
        }
    },

    // 2. Vue Single File Component (.vue) Configuration
    {
        files: ['resources/js/**/*.{vue}'],
        
        // SPREAD FIX: Spread the combined Vue configuration OBJECT into this block.
        // This ensures properties like 'rules' and 'plugins' from the Vue configs are included.
        ...combinedVueConfig,
        
        // Define the plugin object explicitly (for safety, though often included in the spread)
        plugins: {
            vue: vuePlugin, 
        },

        languageOptions: {
            // Must define the parser here, applied AFTER the combined config spread
            parser: 'vue-eslint-parser', 
            parserOptions: {
                parser: '@babel/eslint-parser', 
                ecmaVersion: 'latest', 
                sourceType: 'module',
                requireConfigFile: false, 
            },
        },
        
        // Custom rules to override the recommended ones (applied last)
        rules: {
            // Your custom overrides here
            'vue/multi-word-component-names': 'off', 
            'vue/require-default-prop': 'off',
            'vue/html-indent': 'off', 
        },
    },

    // 3. JavaScript (.js) Configuration
    {
        files: ['resources/js/**/*.js'],
    },

    // 4. Prettier Integration (Must be LAST)
    prettierConfig
];