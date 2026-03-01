#!/usr/bin/env node

/**
 * Commit Message Hook
 * 
 * Automatically fixes common commit message format issues:
 * - Missing type prefix
 * - Non-English characters
 * - Lowercase start
 * - Subject line too long
 * - Subject empty
 * - Body not sentence case
 * - No whitespace between type and scope
 * - Subject ends with punctuation
 */

export default {
  rules: [
    {
      name: 'type-missing',
      level: 'error',
      msg: 'Commit message must start with a type prefix like "feat:" or "fix:" or "docs:"'
    },
    {
      name: 'non-english',
      level: 'error',
      msg: 'Commit message must be in English only'
    },
    {
      name: 'lowercase-start',
      level: 'error',
      msg: 'Commit type must start with lowercase (feat:, fix:, docs:, etc.)'
    },
    {
      name: 'subject-too-long',
      level: 'warn',
      msg: 'Subject line should be 72 chars or less'
    },
    {
      name: 'subject-empty',
      'level: 'error',
      msg: 'Commit message cannot be empty'
    },
    {
      name: 'body-sentence-case',
      level: 'warn',
      msg: 'Body should start with sentence case, not lowercase'
    },
    {
      name: 'scope-whitespace',
      level: 'error',
      msg: 'No whitespace between type and scope (should be `feat:` not `feat :` or `feat :  `)'
    },
    {
      name: 'subject-punctuation',
      level: 'error',
      msg: 'Subject should end with punctuation (period, exclamation, question mark, etc.)'
    }
  ],

  default: {
    allowMergeCommits: true,
    allowEmpty: false,
    allowCustomRules: false,
  }
}

export default failureMsg = 'Commit message validation failed!'
