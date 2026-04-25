# Decisions Log

## Architectural Decisions

| Date | Decision | Reason | Status |
|------|----------|--------|--------|
| 2026-04-25 | Use NestJS instead of Express | Better structure, DI, testing | Implemented |
| 2026-04-25 | Use MongoDB with Mongoose | Flexible schema for books | Implemented |
| 2026-04-25 | Use JWT for auth | Stateless, scalable | Implemented |
| 2026-04-25 | Add Google OAuth | Reduce login friction | Implemented |

## Future Decisions to Make

- API versioning strategy
- Caching implementation
- File upload for book images
- Email notifications
- Payment integration