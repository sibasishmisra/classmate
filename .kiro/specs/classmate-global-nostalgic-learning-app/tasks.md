# Implementation Plan: ClassMate.info

## Overview

This implementation plan breaks down the ClassMate.info application into sequential, testable tasks. The application is a Next.js 14+ web app with TypeScript that provides AI-powered educational explanations with a nostalgic school-themed interface. Each task builds on previous work, with checkpoints to ensure quality and correctness.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Configure Tailwind CSS with custom nostalgic design tokens
  - Set up ESLint, Prettier, and TypeScript strict mode
  - Install dependencies: Framer Motion, fast-check (for property tests)
  - Create environment variable structure for Claude API key
  - Set up project directory structure (components, lib, app, types)
  - _Requirements: 13.1, 13.2, 13.3, 13.8_

- [x] 2. Core TypeScript types and interfaces
  - [x] 2.1 Define domain models and API types
    - Create types for LearningLevel, LearningSession, TopicEntry, FollowUpQuestion
    - Create API request/response interfaces (ExplainRequest, ExplainResponse, AnswerRequest, AnswerResponse)
    - Create Claude API interfaces (ClaudeRequest, ClaudeMessage, ClaudeResponse)
    - Create error types and user settings interfaces
    - _Requirements: 13.6, 1.2, 2.2, 3.1_

  - [ ]* 2.2 Write property test for input validation types
    - **Property 2: Input Validation Consistency**
    - **Validates: Requirements 2.2, 2.4, 2.7**

- [x] 3. Visual design system and Tailwind configuration
  - [x] 3.1 Configure Tailwind with nostalgic design tokens
    - Add custom colors (chalk-white, chalkboard-black, paper-cream, etc.)
    - Configure typography (Lora serif, DM Sans sans-serif)
    - Set up spacing, border radius, and shadow utilities
    - Add custom CSS for chalkboard texture and notebook paper patterns
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 3.2 Create texture assets and nostalgic elements
    - Add chalkboard texture image to public/textures/
    - Create CSS classes for chalk text effect, notebook paper, and chalkboard background
    - Implement ruled lines and margin line patterns
    - _Requirements: 5.2, 5.3, 5.6_

- [x] 4. Utility functions and validation
  - [x] 4.1 Implement input validation and sanitization
    - Create validateTopicInput function (1-500 characters)
    - Create sanitizeInput function (remove/escape HTML, scripts, special characters)
    - Create content safety validation helpers
    - _Requirements: 2.2, 2.4, 14.5, 15.2_

  - [ ]* 4.2 Write property tests for validation functions
    - **Property 2: Input Validation Consistency**
    - **Property 13: Input Sanitization**
    - **Validates: Requirements 2.2, 2.4, 14.5**

  - [x] 4.3 Implement session storage utilities
    - Create persistSession function (save to localStorage)
    - Create loadSession function (retrieve from localStorage with validation)
    - Create clearSession function
    - Handle storage errors gracefully (quota exceeded, unavailable)
    - _Requirements: 11.4, 11.5_

  - [ ]* 4.4 Write property test for session storage round-trip
    - **Property 11: Session Data Round-Trip**
    - **Validates: Requirements 11.4**

- [x] 5. Checkpoint - Verify foundation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Context providers for state management
  - [x] 6.1 Create SessionContext provider
    - Implement state for level, currentTopic, history (max 10 entries)
    - Implement setLevel, submitTopic, answerFollowUp, clearSession actions
    - Add loading and error state management
    - Integrate with localStorage persistence
    - _Requirements: 1.2, 1.6, 11.1, 11.2, 11.3_

  - [ ]* 6.2 Write property tests for session state
    - **Property 1: Level Selection Persistence**
    - **Property 8: Session History Addition**
    - **Property 9: Session History Size Limit**
    - **Property 10: Session Cache Retrieval**
    - **Validates: Requirements 1.2, 11.1, 11.2, 11.3**

  - [x] 6.3 Create SettingsContext provider
    - Implement state for soundEnabled, animationsEnabled, reducedMotion
    - Implement toggleSound and toggleAnimations actions
    - Persist settings to localStorage
    - Detect prefers-reduced-motion media query
    - _Requirements: 6.7, 10.7_

  - [x] 6.4 Create SoundManager utility
    - Implement sound preloading and playback
    - Create play, toggle, and volume control methods
    - Handle autoplay restrictions gracefully
    - Add sound effects: bell-soft, page-turn, chalk-tap, success-chime
    - _Requirements: 6.2, 6.7_

- [x] 7. API routes and Claude integration
  - [x] 7.1 Implement POST /api/explain route
    - Validate request body (topic 1-500 chars, level 1-6)
    - Sanitize input before sending to Claude API
    - Format Claude API request with age-appropriate system prompt
    - Parse Claude response for explanation text
    - Generate 2 follow-up questions in same API call
    - Return combined response with explanation and follow-up questions
    - Implement error handling for all error types
    - _Requirements: 3.1, 3.2, 3.4, 4.1, 14.2, 14.5, 14.6_

  - [x] 7.2 Write property tests for API request formatting
    - **Property 3: API Request Formatting**
    - **Property 4: Response Length Handling**
    - **Property 5: Follow-Up Question Count**
    - **Validates: Requirements 3.1, 3.2, 3.4, 4.1**

  - [x] 7.3 Implement POST /api/answer route
    - Validate request body (question, context, level)
    - Sanitize input
    - Format Claude API request with context from original explanation
    - Parse and return answer
    - Implement error handling
    - _Requirements: 4.3, 14.2, 14.5, 14.6_

  - [ ]* 7.4 Write property tests for API security
    - **Property 13: Input Sanitization**
    - **Property 14: Response Validation**
    - **Property 15: Request Timeout**
    - **Validates: Requirements 14.5, 14.6, 14.7**

  - [x] 7.5 Implement rate limiting middleware
    - Track requests per IP address
    - Enforce 10 requests per 60-second window
    - Return 429 status with retry-after header when limit exceeded
    - _Requirements: 14.4_

  - [ ]* 7.6 Write property test for rate limiting
    - **Property 12: Rate Limiting Enforcement**
    - **Validates: Requirements 14.4**

  - [x] 7.7 Implement GET /api/health route
    - Return status, timestamp, and Claude API connectivity check
    - _Requirements: 14.8_

  - [ ]* 7.8 Write integration tests for API routes
    - Test complete request/response cycles
    - Test error scenarios (invalid input, API failures, timeouts)
    - Test rate limiting behavior
    - Mock Claude API responses

- [x] 8. Checkpoint - Verify API layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Core UI components - Level selection
  - [x] 9.1 Create LevelCard component
    - Display age range and level number
    - Apply chalkboard texture background
    - Implement hover effects (lift, chalk dust particles)
    - Add selected state styling with gold border
    - Ensure 44x44px minimum touch target on mobile
    - _Requirements: 1.1, 1.4, 1.5, 7.5_

  - [x] 9.2 Create LevelSelector component
    - Render 6 LevelCard components (ages 9-14)
    - Implement onLevelSelect callback
    - Arrange in responsive grid (2 rows mobile, 3 columns desktop)
    - Add optional school bell sound on selection
    - _Requirements: 1.1, 1.2, 1.5, 6.2_

  - [ ]* 9.3 Write unit tests for LevelSelector
    - Test rendering of 6 level cards
    - Test level selection callback
    - Test selected state highlighting
    - Test responsive layout

  - [ ]* 9.4 Write property test for level persistence
    - **Property 1: Level Selection Persistence**
    - **Validates: Requirements 1.2, 1.6**

- [ ] 10. Core UI components - Topic input
  - [x] 10.1 Create NotebookTextarea component
    - Apply notebook paper texture background with ruled lines
    - Add margin line (red vertical line on left)
    - Style with handwriting-style placeholder text
    - Implement real-time character counter (0/500)
    - Add padding for margin area
    - _Requirements: 2.1, 2.3, 2.6, 5.3_

  - [x] 10.2 Create TopicInput component
    - Integrate NotebookTextarea
    - Implement character count validation (1-500)
    - Enable/disable submit button based on validation
    - Display inline validation errors
    - Add submit button with vintage school styling
    - Show loading state during API call
    - _Requirements: 2.2, 2.4, 2.5, 2.7_

  - [ ]* 10.3 Write unit tests for TopicInput
    - Test character counter updates
    - Test submit button enable/disable logic
    - Test validation error display
    - Test loading state

  - [ ]* 10.4 Write property test for input validation
    - **Property 2: Input Validation Consistency**
    - **Validates: Requirements 2.2, 2.4, 2.7**

- [ ] 11. Core UI components - Explanation display
  - [x] 11.1 Create TypewriterText component
    - Implement character-by-character animation (30ms per char)
    - Allow skipping animation by clicking
    - Respect prefers-reduced-motion (instant display)
    - Apply chalk text styling (cream color, text shadow)
    - _Requirements: 3.7, 3.8, 6.5, 10.7_

  - [x] 11.2 Create ChalkboardSection component
    - Apply chalkboard texture background
    - Add subtle noise overlay and radial gradient
    - Ensure proper contrast for accessibility
    - _Requirements: 3.8, 5.2, 10.1_

  - [x] 11.3 Create ExplanationDisplay component
    - Integrate ChalkboardSection and TypewriterText
    - Display topic, level, and explanation
    - Render FollowUpQuestions component
    - Handle loading and error states
    - _Requirements: 3.3, 3.7, 3.8_

  - [ ]* 11.4 Write unit tests for ExplanationDisplay
    - Test explanation rendering
    - Test typewriter animation
    - Test loading state display
    - Test error state display

- [ ] 12. Core UI components - Follow-up questions
  - [x] 12.1 Create QuestionCard component
    - Display question text with raised hand icon (✋)
    - Implement hover effects (rotation, scale)
    - Add click handler to fetch answer
    - Implement accordion-style expansion for answer display
    - Apply chalk styling and nostalgic elements
    - _Requirements: 4.2, 4.5_

  - [x] 12.2 Create FollowUpQuestions component
    - Render exactly 2 QuestionCard components
    - Handle answer fetching via API
    - Ensure both questions remain accessible when one is answered
    - Arrange side-by-side on desktop, stacked on mobile
    - _Requirements: 4.1, 4.2, 4.6_

  - [ ]* 12.3 Write unit tests for FollowUpQuestions
    - Test rendering of 2 question cards
    - Test answer fetching and display
    - Test that other question remains clickable
    - Test responsive layout

  - [ ]* 12.4 Write property tests for follow-up questions
    - **Property 5: Follow-Up Question Count**
    - **Property 6: Follow-Up Question Accessibility**
    - **Validates: Requirements 4.1, 4.6**

- [ ] 13. Checkpoint - Verify core components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Animation and micro-interactions
  - [x] 14.1 Implement chalk dust particle system
    - Create canvas-based particle animation
    - Trigger on level card hover and button clicks
    - Use 8 particles on desktop, 4 on mobile
    - Respect prefers-reduced-motion
    - _Requirements: 6.3, 10.7_

  - [x] 14.2 Implement page transition animations
    - Create notebook page flip animation
    - Apply between level selection and topic input
    - Use CSS 3D transforms (perspective, rotateY)
    - Reduce duration on mobile (300ms vs 500ms)
    - _Requirements: 6.4, 10.7_

  - [x] 14.3 Implement loading spinners
    - Create chalk writing spinner animation
    - Create paper flip loader animation
    - Display during API calls
    - _Requirements: 8.2_

  - [x] 14.4 Implement success celebration animation
    - Create confetti-style animation with school-themed elements (⭐📚✏️🎓)
    - Trigger after viewing both follow-up questions
    - Play optional success-chime sound
    - _Requirements: 6.1_

  - [x] 14.5 Add haptic feedback for mobile
    - Implement light haptic on button press
    - Implement medium haptic on level selection
    - Implement heavy haptic pattern on errors
    - _Requirements: 6.6_

  - [ ]* 14.6 Write unit tests for animations
    - Test animation triggers
    - Test reduced motion handling
    - Test mobile vs desktop animation differences

- [ ] 15. Session history and navigation
  - [x] 15.1 Create HistoryTab component
    - Display topic title and timestamp
    - Style as notebook tab or bookmark
    - Implement click handler to load cached entry
    - _Requirements: 11.7_

  - [x] 15.2 Create SessionHistory component
    - Render up to 10 HistoryTab components
    - Display most recent topics first
    - Handle empty state
    - Integrate with SessionContext
    - _Requirements: 11.2, 11.3, 11.7_

  - [x] 15.3 Add "Start New Topic" button
    - Clear current explanation view
    - Return to topic input
    - Maintain session history
    - _Requirements: 11.6_

  - [ ]* 15.4 Write property tests for session history
    - **Property 8: Session History Addition**
    - **Property 9: Session History Size Limit**
    - **Property 10: Session Cache Retrieval**
    - **Validates: Requirements 11.1, 11.2, 11.3**

- [ ] 16. Error handling and friendly error displays
  - [x] 16.1 Create FriendlyErrorDisplay component
    - Display age-appropriate error messages
    - Style with torn paper note aesthetic
    - Show themed icons based on error type
    - Provide retry and go back actions
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [x] 16.2 Implement error handling utilities
    - Create handleNetworkError function
    - Create handleClaudeError function with status code mapping
    - Create handleValidationError function
    - Create handleContentSafetyError function
    - Create handleStorageError function with graceful degradation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 16.3 Implement retry logic with exponential backoff
    - Create retryWithBackoff utility
    - Apply to network timeouts and 503 errors
    - _Requirements: 9.7_

  - [x] 16.4 Implement circuit breaker pattern
    - Create CircuitBreaker class
    - Apply to Claude API calls
    - Prevent cascading failures
    - _Requirements: 9.7_

  - [x] 16.5 Create ErrorBoundary component
    - Catch React errors
    - Display friendly error page
    - Log errors appropriately
    - Provide "Start Over" action
    - _Requirements: 9.5, 9.6_

  - [ ]* 16.6 Write integration tests for error handling
    - Test all error scenarios
    - Test retry logic
    - Test circuit breaker behavior
    - Test error boundary

- [ ] 17. Checkpoint - Verify error handling
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Accessibility implementation
  - [x] 18.1 Add ARIA labels and roles
    - Add aria-label to all interactive elements
    - Add role attributes where appropriate
    - Add aria-live regions for dynamic content
    - _Requirements: 10.3_

  - [x] 18.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Implement logical tab order
    - _Requirements: 10.2, 10.6_

  - [x] 18.3 Ensure color contrast compliance
    - Verify all text meets WCAG 2.1 AA contrast ratios
    - Test chalkboard text (cream on black)
    - Test notebook text (ink black on cream)
    - _Requirements: 10.1_

  - [x] 18.4 Add text alternatives for decorative elements
    - Add alt text or aria-hidden for nostalgic elements
    - Ensure icons have text alternatives
    - _Requirements: 10.5_

  - [x] 18.5 Test zoom and responsive text
    - Verify layout works at 200% zoom
    - Ensure minimum 16px base font size
    - _Requirements: 10.4, 7.7_

  - [ ]* 18.6 Write accessibility tests
    - Run jest-axe on all components
    - Test keyboard navigation flows
    - Test screen reader compatibility

- [x] 19. Responsive layout implementation
  - [x] 19.1 Implement mobile-first layouts
    - Create mobile layouts for all components (320px-767px)
    - Ensure touch targets are 44x44px minimum
    - Stack elements vertically on mobile
    - _Requirements: 7.1, 7.3, 7.5_

  - [x] 19.2 Implement desktop layouts
    - Create desktop layouts for all components (768px+)
    - Arrange elements in multi-column grids
    - Optimize for larger screens
    - _Requirements: 7.2_

  - [x] 19.3 Add viewport transition handling
    - Ensure smooth layout transitions on resize
    - Maintain state during viewport changes
    - _Requirements: 7.4_

  - [ ]* 19.4 Write property test for responsive layout
    - **Property 7: Responsive Layout Integrity**
    - **Validates: Requirements 7.1, 7.2**

- [x] 20. Performance optimization
  - [x] 20.1 Implement code splitting
    - Split routes with dynamic imports
    - Lazy load heavy components (animations, sounds)
    - _Requirements: 8.5_

  - [x] 20.2 Optimize assets
    - Compress texture images
    - Use next/image for optimized image loading
    - Preload critical fonts (Lora, DM Sans)
    - _Requirements: 8.4_

  - [x] 20.3 Implement caching strategies
    - Cache static assets with service worker
    - Set appropriate cache headers
    - _Requirements: 8.7_

  - [x] 20.4 Add loading performance monitoring
    - Implement progress indicator for slow API responses (>5s)
    - Monitor initial page load time
    - _Requirements: 8.1, 8.6_

  - [ ]* 20.5 Write performance tests
    - Test initial load time on 3G
    - Test interaction response times (<50ms)
    - Run Lighthouse CI

- [x] 21. Content safety and privacy
  - [x] 21.1 Implement content safety filters
    - Add client-side inappropriate content detection
    - Configure Claude API for content filtering
    - Implement response content validation
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 21.2 Implement privacy-preserving logging
    - Log API metadata (timestamp, level, response time)
    - Exclude student topics from logs
    - _Requirements: 14.8, 15.5_

  - [ ]* 21.3 Write property tests for content safety
    - **Property 16: Privacy-Preserving Logging**
    - **Property 17: Content Validation**
    - **Property 18: Response Content Filtering**
    - **Validates: Requirements 14.8, 15.2, 15.3**

- [x] 22. Global localization foundation
  - [x] 22.1 Use culturally neutral language
    - Review all UI text for cultural neutrality
    - Use age-based level labels instead of grade numbers
    - Avoid country-specific terminology
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 22.2 Configure Claude prompts for global examples
    - Instruct Claude to use universally relatable examples
    - Avoid cultural assumptions in prompts
    - _Requirements: 12.4, 12.5_

  - [x] 22.3 Prepare codebase for i18n
    - Structure code for future multi-language support
    - Use ISO standards for formatting
    - _Requirements: 12.6, 12.7_

- [x] 23. Final integration and polish
  - [x] 23.1 Wire all components together in main page
    - Integrate all context providers
    - Connect LevelSelector → TopicInput → ExplanationDisplay flow
    - Add SessionHistory sidebar/panel
    - Implement error boundary at root level
    - _Requirements: All_

  - [x] 23.2 Add settings panel
    - Create UI for toggling sound and animations
    - Persist settings to localStorage
    - _Requirements: 6.7_

  - [x] 23.3 Final visual polish
    - Review all nostalgic elements for consistency
    - Ensure smooth transitions between all states
    - Verify typography and spacing
    - _Requirements: 5.7, 5.8_

  - [ ]* 23.4 Write end-to-end tests
    - Test complete learning flow (level → topic → explanation → follow-up)
    - Test session history flow
    - Test error recovery flows
    - Test settings persistence

- [ ] 24. Final checkpoint - Complete testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 25. Deployment preparation
  - [x] 25.1 Configure environment variables
    - Set up .env.example with required variables
    - Document Claude API key setup
    - _Requirements: 13.5, 14.1_

  - [x] 25.2 Create production build
    - Run production build and verify no errors
    - Test production bundle size
    - Verify all environment variables are properly configured
    - _Requirements: 13.1_

  - [x] 25.3 Add deployment documentation
    - Document deployment steps
    - Document environment setup
    - Document API key configuration
    - _Requirements: 13.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate API routes and external service integration
- All code should be written in TypeScript with strict mode enabled
- The implementation uses Next.js 14+ App Router architecture
- Claude API calls are made server-side only for security
