const baseConfig = require('@gabrielduartem/semantic-release-config')

module.exports = {
  ...baseConfig,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/npm',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/git',
      {
        message:
          // eslint-disable-next-line no-template-curly-in-string
          'chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
      },
    ],
  ],
}
