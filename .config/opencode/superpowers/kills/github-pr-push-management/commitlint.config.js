/**
 * Commitlint Configuration for NavGate
 * 
 * Enforces Conventional Commits specification with English-only messages.
 * Validates commit message format against project-specific types and scopes.
 * 
 * @see https://www.conventionalcommits.org/
 */

export default {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    'type-enum': [2, 'always'],
    'type-enum': [
      'feat',     // New feature
      'fix',      // Bug fix
      'docs',     // Documentation only
      'style',     // Code style (no functionality change)
      'refactor', // Code refactoring (no functionality change)
      'perf',      // Performance improvement
      'test',      // Adding or updating tests
      'build',     // Build system or dependencies
      'ci',       // CI/CD configuration
      'chore',     // Maintenance tasks (dependencies, configs, etc.)
      'revert'     // Revert a commit
    ],
    'type-empty': [2, 'never'],
    
    'scope-enum': [2, 'always'],
    'scope-enum': [
      'frontend',  // Frontend app changes
      'backend',  // Backend server changes
      'packages/types', // Shared types package
      'packages/utils', // Shared utils package
      'packages/validation', // Shared validation package
      'docker',     // Docker configuration
      'ci',         // CI/CD workflows
      'deps',       // Dependency updates
      'config',      // Configuration changes
      'docs',       // Documentation updates
    ],
    
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    
    'subject-empty': [2, 'never'],
    
    'header-max-length': [2, 'always', 72],
    
    'footer-max-line-length': [2, 'always', 100],
    
    // Footer must match issue tracker format (optional)
    'references-empty': [1, 'always'],
    
    // English-only validation (custom plugin)
    'english-only': [2, 'always'],
    
    rules: {
      'english-only': [2, 'always'],
      {
        'english-only': ({ subject }) => {
          // Check if subject contains non-English characters
          const nonEnglishPattern = /[\u4e00-\u9fff\u3040-\u309f\u4e00-\u9fff]/
          
          if (nonEnglishPattern.test(subject)) {
            return [
              false,
              `Commit message must be in English only.`,
              `你的提交信息必须使用英文。\n\nExample: ✅ "feat(frontend): add export/import data functionality"`
            ]
          }
        }
      }
    },
    
    'header-max-length': [2, 'always', 72],
    
    'footer-max-line-length': [2, 'always', 100],
    
    // Enforce project-specific types and scopes
    'navgate-types': [2, 'always'],
    'navgate-scopes': [2, 'always'],
    'navgate-allowed': [2, 'always'],
    
    // Parser preset
    'parser-preset': 'conventional-changelog'
  },
  
  plugins: [
    {
      rules: {
        'english-only': [2, 'always'],
        {
          'english-only': ({ subject }) => {
            // Check if subject contains non-English characters
            const nonEnglishPattern = /[\u4e00-\u9fff\u3040-\u309f\u4e00-\u9fff]/
            
            if (nonEnglishPattern.test(subject)) {
              return [
                false,
                `Commit message must be in English only.\n\nExample: ✅ "feat(frontend): add export/import data functionality"`
              ]
            }
          }
        }
      }
    }
  ]
}
