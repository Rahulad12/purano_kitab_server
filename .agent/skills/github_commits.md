# GitHub Commits & Push Skill

## Purpose

Commit changes and push to GitHub repository with proper convention.

## When to Use

- Saving local changes
- Syncing to remote
- Creating commits with proper messages
- Pushing to remote branches

## Prerequisites

- Git installed
- GitHub remote configured
- No uncommitted secrets

## Execution Strategy

### 1. Check Status

```bash
# Check current state
git status

# Check tracked files
git status --short
```

### 2. Stage Changes

```bash
# Stage all changes
git add .

# Stage specific file
git add src/modules/users/user.service.ts

# Stage files matching pattern
git add "src/**/*.ts"

# Stage with interactive choice
git add -i
```

### 3. Commit with Conventional Commits

```bash
# Commit with message
git commit -m "feat(auth): add Google OAuth logout endpoint"

# Commit with body and footer
git commit -m "fix(book): resolve price filter issue" -m "Filter was ignoring string prices"

# Amend last commit (if not pushed)
git commit --amend -m "feat(api): update endpoint"
```

### Message Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add Google login` |
| `fix` | Bug fix | `fix(book): search not working` |
| `docs` | Documentation | `docs(api): update README` |
| `style` | Formatting | `style(book): format code` |
| `refactor` | Restructuring | `refactor(user): simplify schema` |
| `test` | Tests | `test(auth): add unit tests` |
| `chore` | Maintenance | `chore(deps): update mongoose` |

### 4. Review Changes

```bash
# View staged changes
git diff --cached

# View last commit
git log -1 --stat
```

### 5. Push to Remote

```bash
# Push to current branch
git push

# Push to specific branch
git push origin feature/add-login

# Push and set upstream
git push -u origin feature/add-login

# Force push (use with caution)
git push --force-with-lease
```

## Full Workflow Example

```bash
# 1. Check status
git status

# 2. Review diff
git diff src/modules/book/book.service.ts

# 3. Stage changes
git add src/modules/book/book.service.ts

# 4. Commit with type
git commit -m "feat(book): add search by category filter"

# 5. Push to remote
git push -u origin feature/add-category-filter
```

## Branch-Based Commit Workflow

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "feat(api): add new endpoint"

# Push branch
git push -u origin feature/new-feature

# Create pull request (if gh cli available)
gh pr create --title "feat: new feature" --body "Description"
```

## Undo Changes

```bash
# Unstage file
git reset HEAD src/file.ts

# Discard unstaged changes
git checkout -- src/file.ts

# Revert commit (creates new commit)
git revert abc123

# Reset to previous commit (dangerous)
git reset --hard abc123
```

## Commit Message Checklist

- [ ] Starts with type (feat, fix, docs, etc.)
- [ ] Contains scope (optional)
- [ ] Clear description
- [ ] No secrets/credentials
- [ ] Matches change content

## Common Issues

### "Nothing to commit"
- Check `git status`
- Verify file changes exist

### "Push rejected"
- Pull changes first: `git pull origin branch`
- Or force push (carefully): `git push --force-with-lease`

### "Commit contains secrets"
- Remove secrets before committing
- Check `.gitignore`

## Commands Reference

```bash
# Quick commit and push
git add . && git commit -m "type: description" && git push

# Amend and force push (unshared commits only)
git commit --amend && git push --force-with-lease
```