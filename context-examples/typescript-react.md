# React TypeScript Project

## Project Overview
This is a React 18 application built with TypeScript and Vite.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: React 18 with TypeScript
- **Build**: Vite 5.x
- **Styling**: Tailwind CSS
- **State**: React Query + Zustand
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## Project Structure
```
src/
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs)
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks
├── pages/                # Page components (routes)
├── services/             # API client and services
├── stores/               # Zustand state stores
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── App.tsx               # Root component
public/                   # Static assets
tests/                    # Test files (mirrors src/ structure)
```

## Coding Standards

### TypeScript
- Enable strict mode in tsconfig.json
- Prefer interfaces over types for object shapes
- Use type inference where possible
- Avoid `any` - use `unknown` if type is truly unknown

### Components
- Functional components only (no class components)
- Use named exports for components
- Props interface named `{ComponentName}Props`
- Destructure props in function signature

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

### Hooks
- Custom hooks start with `use` prefix
- Return objects for multiple values (not arrays)
- Keep hooks focused and composable

### State Management
- React Query for server state
- Zustand for client state
- Avoid prop drilling - use context or stores

### Styling
- Use Tailwind utility classes
- Extract repeated patterns to components
- Use CSS variables for theme values

### Testing
- Co-locate tests with components (*.test.tsx)
- Test behavior, not implementation
- Use userEvent over fireEvent
- Aim for 80%+ coverage on critical paths

## API Conventions

### Services
- One service file per API domain
- Use React Query for data fetching
- Type all API responses

### Error Handling
- Use Error Boundaries for UI errors
- Toast notifications for user-facing errors
- Log errors to monitoring service

## Current Sprint
- Implementing dark mode support
- Adding form validation with React Hook Form + Zod
- Setting up Storybook for component documentation

## Common Commands
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```
