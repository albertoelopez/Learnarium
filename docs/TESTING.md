# Learnarium Testing Documentation

## Test Summary

**Last Updated:** February 2, 2026

### Overall Test Results

| Test Type | Passed | Failed | Total | Coverage |
|-----------|--------|--------|-------|----------|
| Unit Tests | 40 | 0 | 40 | 95.7% |
| E2E Tests | 4 | 0 | 4 | N/A |
| **Total** | **44** | **0** | **44** | **95.7%** |

### Test Suite Status: ✅ ALL TESTS PASSING

All critical functionality is tested and working correctly. 100% of tests pass when using Groq as the AI provider for E2E testing.

## Unit Test Details

### Test Suites (7 total, all passing)

1. **PalaceCreator.test.tsx** - Component rendering and user interactions
2. **PalaceEditor.test.tsx** - Palace editing and validation
3. **ConceptMapper.test.tsx** - Learning content mapping
4. **edge-cases.test.tsx** - Edge case and stress testing
5. **api-provider-switching.test.ts** - Multi-provider AI support
6. **ollama-integration.test.ts** - Local AI model integration
7. **palace-template.test.ts** - Data structure validation

### Code Coverage Report

```
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
---------------------|---------|----------|---------|---------|----------------
All files            |   95.7  |   80.48  |   92.3  |  95.39  |
 components          |  95.52  |   68.75  |    100  |  95.45  |
  ConceptMapper.tsx  |  92.59  |    62.5  |    100  |  92.59  | 43,49
  PalaceCreator.tsx  |  96.15  |      75  |    100  |  96.15  | 37
  PalaceEditor.tsx   |    100  |     100  |    100  |    100  |
 components/ui       |  96.96  |   66.66  |  83.33  |  96.49  |
  alert.tsx          |  93.75  |     100  |  66.66  |  92.85  | 38
  badge.tsx          |    100  |     100  |    100  |    100  |
  button.tsx         |    100  |   66.66  |    100  |    100  | 43
  card.tsx           |  96.15  |     100  |  83.33  |  95.23  | 70
  textarea.tsx       |    100  |     100  |    100  |    100  |
 lib                 |    100  |     100  |    100  |    100  |
  utils.ts           |    100  |     100  |    100  |    100  |
 types               |   92.3  |    90.9  |    100  |     92  |
  palace-template.ts |   92.3  |    90.9  |    100  |     92  | 47,59
```

### Edge Cases Tested

The comprehensive edge case test suite (`edge-cases.test.tsx`) validates:

#### PalaceCreator Edge Cases
- ✅ Extremely long descriptions (10,000+ characters)
- ✅ Special characters and emojis (🏠, @#$%^&*())
- ✅ Whitespace-only input validation
- ✅ Network error handling
- ✅ API timeout handling
- ✅ Malformed API responses
- ✅ Double submission prevention
- ✅ Rapid input changes (100+ consecutive updates)

#### ConceptMapper Edge Cases
- ✅ Extremely long learning text (18,000+ characters)
- ✅ Unicode and international characters (中文, français, русский)
- ✅ Empty palace with no objects
- ✅ Code snippets in learning text

#### PalaceEditor Edge Cases
- ✅ Palace with no rooms
- ✅ Palace with 50+ rooms (stress test)
- ✅ Extremely long room/palace names (1,000+ characters)
- ✅ Timestamp updates on save

## E2E Test Details

### Test Results

| Test Name | Status | Duration | Notes |
|-----------|--------|----------|-------|
| Shows error when description is empty | ✅ PASS | 3.2s | Validation working correctly |
| Shows error when learning text is empty | ✅ PASS | 4.1s | Error handling verified |
| Navigation buttons work correctly | ✅ PASS | 2.8s | UI state management validated |
| Complete user journey | ✅ PASS | 7.4s | Full workflow with AI generation ✨ |

**All E2E tests pass in 17.5 seconds** when using Groq as the AI provider.

### E2E Test Coverage

The end-to-end tests validate the complete user workflow:

1. **Input Validation** ✅
   - Empty description shows error message
   - Empty learning content shows error message
   - Error messages display correctly

2. **Navigation** ✅
   - Step navigation buttons render correctly
   - Button states (enabled/disabled) work properly
   - Multi-step workflow navigation functions

3. **AI Generation** ✅
   - Palace generation completes successfully
   - "Generating..." loading state displays correctly
   - AI response handled and parsed properly

4. **3D Visualization** ✅
   - 3D viewer renders successfully
   - Room and object meshes display correctly
   - Concept mappings visualized with colors
   - User can navigate the 3D space

### AI Provider Selection for E2E Testing

**Recommended:** Use **Groq** (`AI_PROVIDER=groq` in `.env.local`) for E2E testing:
- ⚡ **Fast:** 0.5-3 seconds per AI request
- ✅ **Reliable:** All E2E tests pass in 17.5 seconds
- 🎯 **Accurate:** Produces high-quality palace structures

**Alternative: Ollama** (local AI):
- 🐌 **Slow:** 60-180 seconds per AI request
- ⏱️ **Timeouts:** E2E tests may timeout (increase to 180s)
- 🔒 **Private:** 100% offline and private
- 💡 **Use for:** Manual testing, development, production

**Note:** Tests are configured with 180-second timeouts to accommodate both providers.

## Test Commands

### Run All Unit Tests
```bash
npm test
```

### Run Unit Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test Suite
```bash
npm test -- PalaceCreator
npm test -- edge-cases
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run E2E Tests in UI Mode
```bash
npm run test:e2e -- --ui
```

### Run E2E Tests in Debug Mode
```bash
npm run test:e2e -- --debug
```

## Testing Best Practices

### Unit Testing Guidelines

1. **Test User Interactions:** Simulate clicks, typing, form submissions
2. **Test Edge Cases:** Empty inputs, long strings, special characters
3. **Mock External Dependencies:** API calls, AI providers, network requests
4. **Assert UI State:** Check visibility, text content, disabled states
5. **Test Error Handling:** Network errors, validation errors, timeouts

### E2E Testing Guidelines

1. **Test Complete Workflows:** Full user journeys from start to finish
2. **Use Semantic Selectors:** `getByRole`, `getByText` over CSS selectors
3. **Wait for Async Operations:** Use `waitFor` for AI generation, API calls
4. **Take Screenshots:** Visual debugging for failed tests
5. **Test Error States:** Invalid inputs, network failures

## Continuous Testing

### Pre-Commit Testing
The following tests run automatically before commits:

```bash
npm test -- --coverage --watchAll=false
```

### CI/CD Integration
When setting up continuous integration:

1. Run unit tests on every push
2. Run E2E tests on pull requests
3. Generate coverage reports
4. Block merges if coverage drops below 90%

## Test Maintenance

### When to Update Tests

- **Component Changes:** Update tests when UI components are modified
- **New Features:** Add tests before implementing new functionality (TDD)
- **Bug Fixes:** Add regression tests to prevent bugs from recurring
- **API Changes:** Update mocks when AI provider APIs change

### Test File Locations

```
vizloci/
├── src/__tests__/                 # Unit tests
│   ├── PalaceCreator.test.tsx
│   ├── PalaceEditor.test.tsx
│   ├── ConceptMapper.test.tsx
│   ├── edge-cases.test.tsx
│   ├── api-provider-switching.test.ts
│   ├── ollama-integration.test.ts
│   └── palace-template.test.ts
├── e2e/                           # E2E tests
│   └── memory-palace.spec.ts
└── docs/
    └── TESTING.md                 # This file
```

## Test Coverage Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Statement Coverage | 95.7% | 90% | ✅ Exceeds target |
| Branch Coverage | 80.48% | 75% | ✅ Exceeds target |
| Function Coverage | 92.3% | 85% | ✅ Exceeds target |
| Line Coverage | 95.39% | 90% | ✅ Exceeds target |

## Conclusion

Learnarium has comprehensive test coverage across all critical functionality:

- ✅ **40 unit tests** validate component behavior, edge cases, and error handling
- ✅ **95.7% code coverage** ensures most code paths are tested
- ✅ **4 of 4 E2E tests** pass (100%), validating complete user workflows
- ✅ **All tests pass** in 17.5 seconds with Groq AI provider

The application is **production-ready** from a testing perspective. All user-facing features work correctly, handle errors gracefully, support edge cases, and the complete end-to-end user journey is validated.

## Future Testing Improvements

1. **Mock AI Responses:** Speed up E2E tests by mocking Ollama responses
2. **Visual Regression Testing:** Add screenshot comparison for 3D viewer
3. **Performance Testing:** Measure render times for large palaces (50+ rooms)
4. **Accessibility Testing:** Add automated a11y checks with jest-axe
5. **Mobile E2E Tests:** Test responsive design on mobile viewports
