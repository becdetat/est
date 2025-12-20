# Est - Testing Guide (Phase 5)

## Testing Environment Setup

**Prerequisites:**
- Both client and server running: `npm run dev` (from project root)
- Client accessible at: `http://localhost:3000`
- Server running at: `http://localhost:3001`
- Database: SQLite at `server/prisma/dev.db`

## Manual Testing Checklist

### 1. Single User Session Flow

#### 1.1 Session Creation
- [ ] Navigate to `http://localhost:3000`
- [ ] Fill in your name (e.g., "Alice")
- [ ] Optionally add email for Gravatar
- [ ] Click "Create Session"
- [ ] Verify: Redirected to session page with session ID in URL
- [ ] Verify: Your name appears in "Participants" list
- [ ] Verify: You have a "You (Host)" badge
- [ ] Verify: "Start Feature" button is visible (host only)

#### 1.2 Feature Creation
- [ ] Click "Start Feature" button
- [ ] Enter feature name (e.g., "User Authentication")
- [ ] Enter optional description
- [ ] Click "Start"
- [ ] Verify: Feature appears immediately in "Current Feature" section
- [ ] Verify: Voting cards are enabled and clickable
- [ ] Verify: No page refresh required

#### 1.3 Voting
- [ ] Select a voting card (e.g., "5")
- [ ] Verify: Card highlights/changes appearance when selected
- [ ] Verify: Your participant card shows "Voted" status
- [ ] Verify: "Reveal Results" button appears (host only)

#### 1.4 Results Reveal
- [ ] Click "Reveal Results"
- [ ] Verify: Results section appears below voting cards
- [ ] Verify: Your vote value is displayed (e.g., "5")
- [ ] Verify: Your name appears under the vote value
- [ ] Verify: Voting cards remain visible but may be disabled

#### 1.5 Multiple Features
- [ ] Start a new feature
- [ ] Verify: Previous feature moves to history
- [ ] Verify: New feature becomes current
- [ ] Vote and reveal results for new feature
- [ ] Check feature history (if sidebar implemented)

### 2. Multi-User Session Testing

**Setup:** Open the application in **2-3 different browser windows** or use incognito/private windows to simulate multiple users.

#### 2.1 Session Joining
**Browser 1 (Host - Alice):**
- [ ] Create a new session
- [ ] Copy the session URL from address bar

**Browser 2 (Participant - Bob):**
- [ ] Paste the session URL
- [ ] Enter name "Bob" and email
- [ ] Verify: Automatically joins session
- [ ] Verify: Both Alice and Bob appear in participants list

**Browser 3 (Participant - Carol):**
- [ ] Repeat joining process with name "Carol"
- [ ] Verify: All three participants visible in all windows

#### 2.2 Real-Time Feature Creation
**Browser 1 (Alice - Host):**
- [ ] Start a new feature "API Endpoint Design"

**All Browsers:**
- [ ] Verify: Feature appears immediately without refresh
- [ ] Verify: All users see the same feature
- [ ] Verify: Only host sees "Reveal Results" button

#### 2.3 Real-Time Voting
**Browser 1 (Alice):**
- [ ] Vote "3"
- [ ] Verify: Alice's card shows "Voted"

**Browser 2 (Bob):**
- [ ] Verify: Alice's card shows "Voted" status
- [ ] Vote "5"
- [ ] Verify: Bob's card shows "Voted"

**Browser 3 (Carol):**
- [ ] Verify: Both Alice and Bob show "Voted"
- [ ] Vote "5"

**All Browsers:**
- [ ] Verify: All three participants show "Voted" status in real-time

#### 2.4 Real-Time Results
**Browser 1 (Alice - Host):**
- [ ] Click "Reveal Results"

**All Browsers:**
- [ ] Verify: Results section appears immediately
- [ ] Verify: All votes visible: Alice (3), Bob (5), Carol (5)
- [ ] Verify: Participant names appear under each vote
- [ ] Verify: No consensus indicator (if implemented) since votes differ

#### 2.5 Consensus Testing
**Browser 1 (Alice - Host):**
- [ ] Start new feature "Database Schema"

**All Browsers:**
- [ ] All vote "8"

**Browser 1 (Alice - Host):**
- [ ] Reveal results
- [ ] Verify: Consensus indicator appears (wobble animation if implemented)

### 3. Host Permissions & Restrictions

#### 3.1 Host Controls
**Browser 1 (Host):**
- [ ] Verify: "Start Feature" button visible
- [ ] Verify: "Reveal Results" button visible when feature active
- [ ] Verify: Can create and manage features

**Browser 2 (Non-Host):**
- [ ] Verify: "Start Feature" button NOT visible
- [ ] Verify: "Reveal Results" button NOT visible
- [ ] Verify: Can only vote on features

#### 3.2 Host Transfer (Future Feature)
- [ ] Document: Currently host is permanent (first creator)
- [ ] Note: Host transfer not implemented in current phase

### 4. Persistence & Refresh Testing

#### 4.1 Participant Persistence
**Browser 1:**
- [ ] Create session as "Alice"
- [ ] Note your participant ID (check localStorage or network tab)
- [ ] Refresh the page
- [ ] Verify: Name and email persist (no re-entry required)
- [ ] Verify: Still recognized as host
- [ ] Verify: Same participant ID (not duplicated)

#### 4.2 Session State Persistence
**Browser 1:**
- [ ] Create feature and vote
- [ ] Refresh page
- [ ] Verify: Session loads correctly
- [ ] Verify: Current feature still visible
- [ ] Verify: Your vote is maintained

**Browser 2 (New Participant):**
- [ ] Join session
- [ ] Vote on feature
- [ ] Refresh page
- [ ] Verify: Participant persists (no duplicate)
- [ ] Verify: Vote status maintained

#### 4.3 Multiple Tab Testing
**Browser 1:**
- [ ] Open session in one tab
- [ ] Open same session URL in new tab (same browser)
- [ ] Verify: Both tabs use same participant ID
- [ ] Vote in tab 1
- [ ] Verify: Tab 2 reflects the vote status
- [ ] Verify: No duplicate participants created

### 5. Edge Cases & Error Handling

#### 5.1 Invalid Session
- [ ] Navigate to invalid session ID: `http://localhost:3000/session/invalid-id`
- [ ] Verify: Appropriate error message or redirect
- [ ] Verify: No crash or blank screen

#### 5.2 Empty Name
- [ ] Try creating session with empty name
- [ ] Verify: Validation error or disabled button
- [ ] Verify: Cannot proceed without name

#### 5.3 Empty Feature Name
- [ ] Start feature with empty name
- [ ] Verify: Validation error
- [ ] Verify: Feature not created

#### 5.4 Network Interruption Simulation
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to vote or create feature
- [ ] Restore network
- [ ] Verify: Connection re-establishes
- [ ] Verify: Operations sync correctly

#### 5.5 Long Session Testing
- [ ] Create session
- [ ] Leave it open for extended period (30+ minutes)
- [ ] Verify: Socket connection maintains
- [ ] Verify: Can still vote and create features
- [ ] Verify: No memory leaks or performance degradation

#### 5.6 Rapid Actions
- [ ] Click vote cards rapidly
- [ ] Verify: Only last vote registers
- [ ] Start multiple features quickly (host)
- [ ] Verify: All features created properly

### 6. Mobile & Responsive Testing

#### 6.1 Mobile Viewport
- [ ] Open DevTools → Toggle device toolbar
- [ ] Test on iPhone SE (375px width)
- [ ] Test on iPad (768px width)
- [ ] Verify: All buttons accessible
- [ ] Verify: Voting cards responsive
- [ ] Verify: Participant list readable
- [ ] Verify: No horizontal scroll

#### 6.2 Touch Interactions
- [ ] Use touch simulation in DevTools
- [ ] Verify: Cards respond to tap
- [ ] Verify: Buttons work with touch
- [ ] Verify: No double-tap zoom issues

### 7. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Verify: Socket.IO connections work
- [ ] Verify: LocalStorage functions
- [ ] Verify: Gravatar images load
- [ ] Verify: UI renders consistently

### 8. Performance Testing

#### 8.1 Many Participants
- [ ] Open 5+ browser windows
- [ ] Join same session from all
- [ ] Verify: All participants visible
- [ ] Verify: Real-time updates work with many users
- [ ] Verify: No significant lag

#### 8.2 Many Features
- [ ] Create 10+ features in session
- [ ] Vote and reveal each
- [ ] Verify: History maintains correctly
- [ ] Verify: Current feature always displays
- [ ] Verify: No performance degradation

## Automated Testing Setup

### Prerequisites
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Run Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/session-creation.spec.ts
```

## Known Issues & Limitations

Document any issues found during testing:

1. **Issue:** 
   - **Description:** 
   - **Steps to Reproduce:** 
   - **Expected:** 
   - **Actual:** 
   - **Severity:** Critical / High / Medium / Low
   - **Status:** Open / In Progress / Fixed

## Test Results Summary

| Test Category | Total Tests | Passed | Failed | Notes |
|--------------|-------------|--------|--------|-------|
| Single User | | | | |
| Multi-User | | | | |
| Permissions | | | | |
| Persistence | | | | |
| Edge Cases | | | | |
| Mobile | | | | |
| Browser Compat | | | | |
| Performance | | | | |

## Testing Sign-off

- [ ] All critical paths tested
- [ ] Multi-user scenarios verified
- [ ] Edge cases handled
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Performance acceptable
- [ ] Ready for deployment

**Tested by:** _______________  
**Date:** _______________  
**Version:** v1.0.0  
