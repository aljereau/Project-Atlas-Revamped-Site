import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/**'
    ]
  },

  // Base JavaScript configuration
  js.configs.recommended,
  
  // TypeScript configuration for all TS/TSX files
  ...tseslint.configs.recommended,
  
  // Custom configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    }
  },
  
  // TypeScript-specific rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // Custom rules that match our previous configuration
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-unused-vars': 'off'
    }
  }
) 