# Zoom and Responsive Text - Manual Testing Guide

## Quick Reference

### Requirements Being Tested
- **Requirement 10.4**: Browser zoom up to 200% without breaking layout
- **Requirement 7.7**: Minimum 16px base font size for readability

### Test Duration
Approximately 10-15 minutes

---

## Pre-Test Setup

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: Navigate to `http://localhost:3000`

3. **Reset zoom**: Ensure browser is at 100% zoom (Ctrl/Cmd + 0)

4. **Prepare browser**: Use Chrome, Firefox, or Safari for testing

---

## Test 1: Base Font Size Verification

### Objective
Verify that the base font size is 16px or larger.

### Steps

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Select the `<body>` element in the Elements/Inspector tab
3. Check the Computed styles panel
4. Find `font-size` property

### Expected Result
✅ Font size should be **16px** (browser default)

### Actual Result
- [ ] PASS: 16px or larger
- [ ] FAIL: Less than 16px

---

## Test 2: Zoom Level Testing

### Test 2.1: 100% Zoom (Baseline)

**Steps:**
1. Ensure zoom is at 100% (Ctrl/Cmd + 0)
2. Navigate through all sections:
   - Level selection
   - Topic input
   - Explanation display
   - Follow-up questions
   - Session history sidebar

**Expected Results:**
- ✅ All text is readable
- ✅ Layout displays correctly
- ✅ No horizontal scrolling
- ✅ All interactive elements are clickable

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

### Test 2.2: 150% Zoom

**Steps:**
1. Zoom to 150% (Ctrl/Cmd + Plus, twice)
2. Navigate through all sections
3. Test interactions (click buttons, type in input)

**Expected Results:**
- ✅ Text scales proportionally (larger but readable)
- ✅ Layout remains intact (may reflow)
- ✅ No horizontal scrolling
- ✅ All buttons remain clickable
- ✅ Touch targets remain adequate size

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

**Screenshot Location:** _______________

---

### Test 2.3: 200% Zoom (Maximum Required)

**Steps:**
1. Zoom to 200% (Ctrl/Cmd + Plus, four times total)
2. Navigate through all sections
3. Test all interactive elements
4. Scroll vertically through content

**Expected Results:**
- ✅ Text remains readable (no pixelation)
- ✅ Layout adapts (likely stacks vertically)
- ✅ No horizontal scrolling required
- ✅ All functionality remains accessible
- ✅ Sidebar may move below main content (responsive)
- ✅ Touch targets remain at least 44x44px

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

**Screenshot Location:** _______________

---

## Test 3: Text Readability at Different Viewport Sizes

### Test 3.1: Mobile Viewport (375px)

**Steps:**
1. Reset zoom to 100%
2. Open DevTools and toggle device toolbar
3. Select iPhone SE or similar (375px width)
4. Navigate through the application

**Expected Results:**
- ✅ Text is at least 16px for body content
- ✅ Headings are proportionally larger
- ✅ No text is smaller than 14px
- ✅ Line length is comfortable (not too wide)
- ✅ Line height provides adequate spacing

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

### Test 3.2: Tablet Viewport (768px)

**Steps:**
1. Set viewport to 768px (iPad)
2. Navigate through the application

**Expected Results:**
- ✅ Text sizes remain readable
- ✅ Layout adapts to medium screen
- ✅ No horizontal scrolling

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

### Test 3.3: Desktop Viewport (1920px)

**Steps:**
1. Set viewport to 1920px (full HD)
2. Navigate through the application

**Expected Results:**
- ✅ Text sizes remain readable (not too small)
- ✅ Content has max-width constraint (not too wide)
- ✅ Line length is comfortable for reading

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

## Test 4: Combined Zoom + Small Viewport

### Objective
Test the most challenging scenario: small viewport with zoom.

**Steps:**
1. Set viewport to 375px (mobile)
2. Zoom to 150%
3. Navigate through the application

**Expected Results:**
- ✅ Content remains accessible
- ✅ Vertical scrolling works smoothly
- ✅ No horizontal scrolling
- ✅ All interactive elements remain usable

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

## Test 5: Font Size Inspection

### Objective
Verify specific text elements meet minimum size requirements.

**Steps:**
1. Reset zoom to 100%
2. Use DevTools to inspect each element type
3. Check computed font-size

### Elements to Check

| Element | Location | Expected Size | Actual Size | Pass/Fail |
|---------|----------|---------------|-------------|-----------|
| H1 (Main title) | Header | ≥30px | _____ | [ ] |
| H2 (Section headings) | Main content | ≥24px | _____ | [ ] |
| Body text (paragraphs) | Explanations | ≥16px | _____ | [ ] |
| Button text | Submit button | ≥16px | _____ | [ ] |
| Link text | Navigation | ≥16px | _____ | [ ] |
| Input text | Topic input | ≥16px | _____ | [ ] |
| History metadata | Sidebar | ≥14px | _____ | [ ] |

---

## Test 6: Browser Compatibility

### Test across browsers

**Chrome/Edge:**
- [ ] 100% zoom: PASS / FAIL
- [ ] 150% zoom: PASS / FAIL
- [ ] 200% zoom: PASS / FAIL

**Firefox:**
- [ ] 100% zoom: PASS / FAIL
- [ ] 150% zoom: PASS / FAIL
- [ ] 200% zoom: PASS / FAIL

**Safari:**
- [ ] 100% zoom: PASS / FAIL
- [ ] 150% zoom: PASS / FAIL
- [ ] 200% zoom: PASS / FAIL

---

## Test 7: Keyboard Navigation at Zoom

### Objective
Ensure keyboard navigation works at all zoom levels.

**Steps:**
1. Set zoom to 200%
2. Use Tab key to navigate through interactive elements
3. Verify focus indicators are visible

**Expected Results:**
- ✅ Tab navigation works correctly
- ✅ Focus indicators are visible and clear
- ✅ No elements are hidden or inaccessible
- ✅ Focus order is logical

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

## Test 8: Screen Reader at Zoom

### Objective
Verify screen reader compatibility at zoom levels.

**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Set zoom to 150%
3. Navigate through the page

**Expected Results:**
- ✅ All content is announced correctly
- ✅ Zoom level doesn't affect screen reader functionality
- ✅ ARIA labels are read properly

**Actual Results:**
- [ ] PASS
- [ ] FAIL (describe issue): _______________

---

## Common Issues to Watch For

### Layout Issues
- [ ] Horizontal scrolling appears
- [ ] Content overlaps or collides
- [ ] Fixed-width elements break layout
- [ ] Images don't scale properly

### Text Issues
- [ ] Text becomes pixelated
- [ ] Text is cut off or hidden
- [ ] Line height becomes too tight
- [ ] Text wrapping issues

### Interaction Issues
- [ ] Buttons become too small to click
- [ ] Input fields are difficult to use
- [ ] Focus indicators are cut off
- [ ] Hover states don't work

### Performance Issues
- [ ] Scrolling is janky
- [ ] Zoom causes lag
- [ ] Animations break

---

## Automated Test Verification

Before manual testing, run automated tests:

```bash
npm test -- app/__tests__/zoom-responsive-text.test.tsx
```

**Expected Result:**
```
Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
```

**Actual Result:**
- [ ] All tests pass
- [ ] Some tests fail (list): _______________

---

## Test Summary

### Overall Results

**Total Tests:** 8 major test categories
**Tests Passed:** _____ / 8
**Tests Failed:** _____ / 8

### Critical Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Minor Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Recommendations
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Sign-Off

**Tester Name:** _______________
**Date:** _______________
**Browser(s) Tested:** _______________
**Operating System:** _______________

**Overall Assessment:**
- [ ] PASS - Ready for production
- [ ] PASS WITH MINOR ISSUES - Can deploy with noted issues
- [ ] FAIL - Requires fixes before deployment

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## Quick Keyboard Shortcuts Reference

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Zoom In | Ctrl + Plus | Cmd + Plus |
| Zoom Out | Ctrl + Minus | Cmd + Minus |
| Reset Zoom | Ctrl + 0 | Cmd + 0 |
| Open DevTools | F12 | Cmd + Option + I |
| Toggle Device Toolbar | Ctrl + Shift + M | Cmd + Shift + M |

---

## Additional Resources

- [WCAG 2.1 Success Criterion 1.4.4: Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [WCAG 2.1 Success Criterion 1.4.10: Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
