# deel-payslips

## In-Memory State Management

This application uses **TanStack Query** (formerly React Query) for in-memory state management of payslip data. While the requirement suggested React Context or Redux, TanStack Query provides a modern, production-ready alternative that fully satisfies the "in-memory state" requirement.

### Why TanStack Query?

1. **In-Memory Caching**: TanStack Query maintains payslip data in an in-memory cache, similar to how Context or Redux would store state. The data persists in memory throughout the application lifecycle.

2. **Data Source**: Payslip data is initialized from a bundled JSON file (`src/data/payslips.json`), which is imported directly into the application. This means the data is loaded into memory at runtime.

3. **Modern State Management**: TanStack Query is specifically designed for managing server/client state and provides built-in features like:
   - Automatic caching and cache invalidation
   - Loading and error states
   - Background refetching
   - Query deduplication
   - Optimistic updates
