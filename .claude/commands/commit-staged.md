Generate commit message for staged changes using Conventional Commits.

1. Run `git diff --staged --stat` and `git diff --staged`
2. Determine type: feat|fix|refactor|docs|test|chore|style|perf|build|ci
3. Output: `<type>(<scope>): <description>` + optional body
4. Rules: imperative, lowercase, <72 chars, explain what/why
5. Warn if no staged changes or if changes should be split
6. Keep the description minimal
7. Commit with message
