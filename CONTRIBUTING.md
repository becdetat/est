# Contributing to Est

Thank you for your interest in contributing to Est! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` files)
4. Generate Prisma client: `cd server && npx prisma generate`
5. Run migrations: `cd server && npx prisma migrate dev`
6. Start development servers: `npm run dev`

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/bug-description`

### Making Changes

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Write/update tests
4. Ensure all tests pass: `npm test`
5. Lint your code: `npm run lint`
6. Format your code: `npm run format`
7. Commit with clear messages

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(voting): add t-shirt sizing option
fix(session): prevent duplicate participants on refresh
docs(readme): update deployment instructions
```

### Pull Requests

1. Push your branch to your fork
2. Create a pull request to `develop` branch
3. Fill in the PR template
4. Link related issues
5. Wait for review

**PR Guidelines:**
- Keep PRs focused and atomic
- Include tests for new features
- Update documentation as needed
- Ensure CI passes
- Respond to review feedback

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for objects
- Use async/await over promises
- Add JSDoc comments for public APIs

### React

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic into custom hooks

### Naming Conventions

- Components: PascalCase (`UserAvatar.tsx`)
- Files: kebab-case (`user-avatar.ts`)
- Variables/functions: camelCase (`getUserById`)
- Constants: UPPER_SNAKE_CASE (`MAX_PARTICIPANTS`)
- Interfaces: PascalCase with 'I' prefix optional (`IUser` or `User`)

## Project Structure

```
est/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API clients
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
├── server/           # Express backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── services/    # Business logic
│   │   ├── socket/      # Socket.IO handlers
│   │   └── utils/       # Utility functions
│   └── prisma/          # Database schema
└── tests/            # E2E tests
```

## Testing

### Unit Tests

```bash
npm test --workspace=server
npm test --workspace=client
```

### E2E Tests

```bash
npm run playwright:install  # First time only
npm run test:e2e
```

### Test Guidelines

- Write tests for new features
- Test edge cases
- Keep tests isolated and independent
- Use descriptive test names
- Mock external dependencies

## Documentation

- Update README for user-facing changes
- Update DEPLOYMENT.md for deployment changes
- Add JSDoc comments for complex functions
- Update API documentation for endpoint changes
- Include code examples where helpful

## Database Changes

### Creating Migrations

```bash
cd server
npx prisma migrate dev --name your-migration-name
```

### Migration Guidelines

- Keep migrations small and focused
- Test migrations both up and down
- Never modify existing migrations
- Document breaking changes

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser)
- Screenshots/logs if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Proposed implementation (optional)
- Mockups/examples (optional)

## Code Review

### As a Reviewer

- Be respectful and constructive
- Focus on code, not the person
- Explain your reasoning
- Suggest improvements
- Approve when satisfied

### As an Author

- Be open to feedback
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers

## Release Process

1. Merge `develop` into `main`
2. Tag release: `git tag v1.x.x`
3. Push tags: `git push --tags`
4. Create GitHub release
5. Update changelog

## Community

- Be respectful and inclusive
- Follow the code of conduct
- Help others in discussions
- Share knowledge and learnings

## Questions?

- Open a GitHub discussion
- Check existing issues
- Read the documentation
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Est! 🎉
