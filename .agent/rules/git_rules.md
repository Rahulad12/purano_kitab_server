# Git Rules

## Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/<description>` | `feature/add-user-profile` |
| Bugfix | `bugfix/<description>` | `bugfix/fix-login-issue` |
| Hotfix | `hotfix/<description>` | `hotfix/fix-production-error` |
| Release | `release/<version>` | `release/v1.0.0` |

## Commit Message Format

Follow [Conventional Commits](https://www.commitizen.com/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Maintenance |

### Examples
```
feat(auth): add Google OAuth login
fix(book): resolve price filter issue
docs(api): update endpoint documentation
refactor(user): simplify user schema
```

## Pull Request Requirements

- Title follows commit format
- Description explains changes
- Link related issues
- Pass all tests
- Pass linting

## Branch Strategy

- `main` - Production code
- `develop` - Development code
- Feature branches from `develop`
- Merge via PR to `develop`

## Working Directory

- Work on feature branches
- Keep branches up to date with develop
- Rebase instead of merge locally