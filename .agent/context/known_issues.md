# Known Issues

## Current Limitations

| Issue | Description | Severity | Status |
|-------|-------------|----------|--------|
| No image upload | Book images via URL only | Medium | Planned |
| No pagination metadata | Total count not returned | Low | Known |
| No rate limiting | API vulnerable to abuse | Medium | Known |

## Tech Debt

- No unit tests for services
- No integration tests
- No API versioning
- Hardcoded "featured" threshold (1 favorite)

## Resolved

- [x] Google OAuth token refresh