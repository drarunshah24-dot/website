# Contributing to National Urology Center Website

Thank you for investing your time in contributing to our project!

## Git Workflow
1. Create a branch from \main\.
2. Name your branch using the following convention:
   - \eature/short-description\ for new features
   - \ugfix/short-description\ for bug fixes
   - \docs/short-description\ for documentation updates
3. Make your changes and commit them following the Conventional Commits specification.

## Conventional Commits
Please use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.
- \eat:\ A new feature
- \ix:\ A bug fix
- \docs:\ Documentation only changes
- \style:\ Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- \efactor:\ A code change that neither fixes a bug nor adds a feature
- \perf:\ A code change that improves performance
- \	est:\ Adding missing tests or correcting existing tests
- \chore:\ Changes to the build process or auxiliary tools and libraries such as documentation generation

## Code Quality and CI
Our CI pipeline runs on every push and pull request to \main\.
The pipeline checks:
- **Linting**: \
pm run lint\ must pass with zero warnings.
- **Type Checking**: \
px tsc --noEmit\ must pass.
- **Build**: \
pm run build\ must succeed.

Before opening a pull request, run \
pm run lint\ and \
pm run build\ locally to ensure your changes pass our quality gates.
