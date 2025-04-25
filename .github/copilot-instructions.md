# GitHub Copilot Instructions for Medimate v3

## Task Management Rules

1. When implementing a feature from the Tasks.md file:

   - Scan Tasks.md to identify the relevant task
   - Upon successful implementation, update the Tasks.md file by marking the completed task as checked (`- [x]`)
   - Include a comment in the commit message referencing the completed task

2. When suggesting code that completes a task:

   - Reference the specific task from Tasks.md in your explanation
   - Indicate which subtasks will be completed by the suggested code
   - Remind developers to mark tasks as complete in Tasks.md after successful implementation

3. When approached with a general question about implementing a feature:
   - Check Tasks.md for related tasks and subtasks
   - Prioritize suggestions that align with incomplete tasks
   - Reference the task structure to provide contextual responses

## Best Practices for Medimate v3 Tech Stack

### React Native & Expo

1. Component Structure:

   - Follow functional component approach with React Hooks
   - Implement components with clear separation of concerns
   - Keep components small and focused on a single responsibility
   - Use proper hierarchy: screens > containers > components > elements

2. State Management:

   - Use React Context for global state when appropriate
   - Implement useReducer for complex state logic
   - Keep state as local as possible, lifting only when necessary
   - Use AsyncStorage for persistent data with proper error handling

3. Performance:

   - Implement React.memo for components that render often but change infrequently
   - Use useCallback and useMemo to prevent unnecessary re-renders
   - Optimize list rendering with FlatList and proper key management
   - Implement virtualization for long lists
   - Avoid anonymous functions in render methods where possible

4. Navigation:
   - Use React Navigation with type safety
   - Implement proper navigation hierarchy
   - Utilize navigation params effectively
   - Implement deep linking when appropriate

### API Integration

1. Data Fetching:

   - Implement proper loading, success, and error states
   - Use try/catch blocks for error handling
   - Create reusable API hooks
   - Consider implementing a request queue for offline support

2. Firebase:
   - Follow security best practices for database rules
   - Implement proper authentication flows
   - Use batch operations for related database changes
   - Optimize queries with proper indexing

### AI Integration

1. Gemini AI:

   - Implement proper context management for conversation history
   - Use streaming responses when appropriate
   - Handle API rate limits and implement fallbacks
   - Manage token usage efficiently

2. Speech & Vision APIs:
   - Implement proper permission handling
   - Provide clear user feedback during processing
   - Handle edge cases (accents, lighting conditions, etc.)
   - Implement fallbacks for failed recognitions

### UI/UX

1. Design System:

   - Use consistent spacing, colors, and typography from a theme
   - Implement responsive design using flex layouts
   - Follow accessibility guidelines (contrast, touch targets, labels)
   - Support both light and dark mode

2. Animations:

   - Use React Native Reanimated for complex animations
   - Implement gesture handlers correctly
   - Ensure animations don't impact performance
   - Provide animation opt-out for reduced motion preferences

3. Forms:
   - Implement proper validation with meaningful error messages
   - Use controlled components for form fields
   - Implement proper keyboard handling
   - Provide clear success/failure feedback

### Testing

1. Unit Testing:

   - Write tests for business logic and utility functions
   - Mock external dependencies appropriately
   - Focus on behavior, not implementation details

2. Component Testing:
   - Test component rendering and interaction
   - Use React Native Testing Library with best practices
   - Implement snapshot testing judiciously

### Security

1. Data Protection:

   - Never store sensitive data in plain text
   - Use secure storage for tokens and sensitive information
   - Implement proper authentication and authorization
   - Validate all user inputs

2. API Security:
   - Use HTTPS for all API requests
   - Implement proper token management and refresh flows
   - Sanitize data before displaying to prevent XSS

### Code Style

1. Formatting:

   - Follow consistent code formatting with ESLint and Prettier
   - Use meaningful variable and function names
   - Keep functions small and focused
   - Document complex logic with comments

2. File Structure:
   - Organize files by feature/module
   - Use index files for clean imports
   - Keep related files close together
   - Follow consistent naming conventions

## Specific Feature Implementation Guidelines

### Virtual Pet System

- Implement state machine for pet emotions
- Use sprite animations for pet interactions
- Store pet state in persistent storage
- Connect pet state to user health activities

### Health Metrics

- Ensure proper data visualization with clear metrics
- Implement health score calculations with transparent methodology
- Use proper units and reference ranges for health data
- Implement data synchronization with wearable devices

### AI Features

- Implement proper conversation management
- Use streaming responses for natural interactions
- Provide clear feedback during AI processing
- Handle edge cases and fallbacks gracefully

### Medication Management

- Implement secure storage of medication data
- Use notifications effectively for reminders
- Implement OCR with proper validation
- Ensure medication database is up-to-date

---

_Note: These instructions will be used by GitHub Copilot when assisting with development of the Medimate v3 application._
