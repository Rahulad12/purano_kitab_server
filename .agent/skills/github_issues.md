# GitHub Issues & Milestones Skill

## Purpose

Create, manage, and track GitHub issues and milestones for project management.

## When to Use

- Reporting bugs
- Feature requests
- Tracking project progress
- Managing release milestones

## Prerequisites

- GitHub CLI installed (`gh`)
- Authenticated with GitHub (`gh auth login`)

## Execution Strategy

### 1. Create Issue

```bash
# Create issue with title
gh issue create --title "Bug: Login fails with Google OAuth"

# Create issue with title and body
gh issue create --title "Feature: Add image upload" --body "Add ability to upload book images"

# Create issue with labels
gh issue create --title "Bug: Price filter not working" --label "bug" --label "priority:high"

# Create issue with milestone
gh issue create --title "Feature: API v2" --milestone "v1.0.0"
```

### 2. List Issues

```bash
# List all open issues
gh issue list

# List issues with specific label
gh issue list --label "bug"

# List issues assigned to you
gh issue list --assignee "@me"

# List issues by state
gh issue list --state all
gh issue list --state closed
```

### 3. View Issue

```bash
# View issue details
gh issue view 123

# View issue in browser
gh issue view 123 --web
```

### 4. Edit Issue

```bash
# Add label to issue
gh issue add-label 123 --label "enhancement"

# Remove label from issue
gh issue remove-label 123 --label "help wanted"

# Assign issue
gh issue add-assignee 123 --assignee "username"

# Close issue
gh issue close 123

# Reopen issue
gh issue reopen 123
```

### 5. Create Milestone

```bash
# Create milestone
gh milestone create --title "v1.0.0" --description "First release"

# Create milestone with due date
gh milestone create --title "v1.1.0" --due-on "2026-06-01"
```

### 6. List Milestones

```bash
# List all milestones
gh milestone list

# List milestone with issues
gh milestone list --json number,title,issues
```

### 7. Manage Milestone

```bash
# View milestone
gh milestone view 1

# Close milestone
gh milestone close 1

# Delete milestone
gh milestone delete 1
```

## Label Conventions

| Label | Description |
|-------|-------------|
| `bug` | Bug report |
| `enhancement` | New feature |
| `documentation` | Docs improvement |
| `help wanted` | Needs contribution |
| `priority:high` | High priority |
| `priority:low` | Low priority |
| `good first issue` | Good for newcomers |

## Milestone Naming

| Format | Example |
|--------|---------|
| Version | `v1.0.0`, `v1.1.0` |
| Sprint | `Sprint 1`, `Sprint 2` |
| Release | `Release Q2 2026` |

## Workflow Example

```bash
# 1. Create milestone for release
gh milestone create --title "v1.0.0" --description "First production release"

# 2. Create issues with milestone
gh issue create --title "Setup CI/CD" --milestone "v1.0.0" --label "enhancement"
gh issue create --title "Add error handling" --milestone "v1.0.0" --label "bug"

# 3. List milestone progress
gh milestone view 1

# 4. Close milestone when all issues done
gh milestone close 1
```

## Common Commands Reference

```bash
# Issues
gh issue create -t "Title" -b "Body" -l "label"
gh issue list --state open
gh issue view N
gh issue close N
gh issue reopen N

# Milestones
gh milestone create -t "Title" -d "Description"
gh milestone list
gh milestone view N
gh milestone close N
```