import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: [ '**/*.{vue,ts,mts,tsx}' ],
  },

  globalIgnores([ '**/dist/**', '**/dist-ssr/**', '**/coverage/**' ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
  {
    name: 'app/custom-rules',
    rules: {
      // Отступы в HTML
      'vue/html-indent': [ 'error', 2 ],

      // Максимум атрибутов на строку
      'vue/max-attributes-per-line': [ 'error', {
        singleline: 3,
        multiline: 1
      } ],

      // Закрывающие скобки
      'vue/html-closing-bracket-newline': [ 'error', {
        singleline: 'never',
        multiline: 'always'
      } ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'keyword-spacing': [ 'error', { after: true } ],
      'max-len': [ 'error', { code: 130, ignorePattern: '^\\s*<path' } ],
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-extra-boolean-cast': 'error',
      'no-multi-spaces': [ 'error' ],
      'no-multiple-empty-lines': [ 'error', { max: 1 } ],
      'no-param-reassign': [ 2, { props: false } ],
      'no-trailing-spaces': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-vars': [ 'error', { argsIgnorePattern: '^_' } ],
      'object-curly-spacing': [ 'error', 'always' ],
      'object-property-newline': [ 'off', { allowAllPropertiesOnSameLine: true } ],
      'padded-blocks': 'off',
      indent: [ 'error', 2, { SwitchCase: 1 } ],
      quotes: [ 'error', 'single' ],
      semi: [ 'error', 'never' ],
      'space-before-function-paren': [
        'error',
        { anonymous: 'never', named: 'never', asyncArrow: 'always' }
      ],
      'object-curly-newline': [
        'error',
        {
          consistent: true,
          multiline: true
        }
      ],
    }
  }
)
