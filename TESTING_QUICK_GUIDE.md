# Est - Quick Testing Guide

## 🚀 Quick Start for Testers

### Setup (One-time)
```bash
npm install
npm run playwright:install
npm run dev
```

Access the application at: http://localhost:3000

### Test Scenarios Priority List

#### ✅ Critical Path (Must Test First)
1. **Create Session** → Enter name → Click "Create Session"
2. **Create Feature** → Click "Start Feature" → Enter name → Click "Start"  
3. **Vote** → Click any voting card (1, 2, 3, 5, 8, 13, etc.)
4. **Reveal Results** → Click "Reveal Results" button

#### 🔄 Multi-User Testing (Open 2-3 Browser Windows)
1. Create session in Window 1 (Alice - Host)
2. Copy URL and paste in Window 2 (Bob)
3. Enter Bob's name to join
4. Alice creates feature
5. Both vote
6. Alice reveals results
7. **Verify:** Both see results immediately

#### 🔁 Persistence Testing
1. Create session
2. Vote on a feature
3. Refresh page (F5)
4. **Verify:** Still in session, vote maintained, no duplicate participant

#### 🚫 Permissions Testing
1. Open 2 windows (Host + Non-host)
2. **Verify Host sees:**
   - "Start Feature" button
   - "Reveal Results" button
3. **Verify Non-host DOES NOT see:**
   - "Start Feature" button
   - "Reveal Results" button

## 🐛 Bug Reporting Template

When you find an issue, please document:

```
**Issue:** Brief description
**Steps to Reproduce:**
1. 
2. 
3. 
**Expected:** What should happen
**Actual:** What actually happened
**Browser:** Chrome/Firefox/Safari
**Screenshots:** (if applicable)
**Severity:** Critical/High/Medium/Low
```

## 📋 Quick Checklist

- [ ] Can create session
- [ ] Can join session via URL
- [ ] Can create feature (host only)
- [ ] Can vote on feature
- [ ] Can reveal results (host only)
- [ ] Results show all votes
- [ ] Page refresh maintains state
- [ ] No duplicate participants on refresh
- [ ] Real-time updates work
- [ ] Mobile responsive (375px width)

## 🔍 What to Look For

**Good Signs:**
- ✅ Instant updates across windows
- ✅ Smooth animations
- ✅ Clear button states (enabled/disabled)
- ✅ "Voted" badge appears when voting
- ✅ All participants visible in list

**Red Flags:**
- ❌ Need to refresh to see updates
- ❌ Duplicate participants appearing
- ❌ Buttons not responding
- ❌ Crashes or blank screens
- ❌ Console errors (open DevTools)

## 🛠️ Troubleshooting

**App won't load?**
1. Check both servers running: `npm run dev`
2. Check ports: Client (3000), Server (3001)
3. Clear browser cache/localStorage

**Socket not connecting?**
1. Check browser console for errors
2. Verify server shows "Client connected"
3. Try different browser

**Tests failing?**
1. Make sure dev server is running
2. Close other browser windows
3. Clear test database: `rm server/prisma/dev.db`

## 📞 Need Help?

- Check [TESTING.md](TESTING.md) for detailed test cases
- Review server logs in terminal
- Open browser DevTools (F12) for errors
- Check Network tab for failed requests

## 🎯 Testing Goals for Phase 5

- **Functionality:** All features work as expected
- **Real-time:** Updates happen instantly across users
- **Stability:** No crashes or data loss
- **Usability:** Intuitive and easy to use
- **Performance:** Fast and responsive
- **Mobile:** Works on phone screens

## 📊 Progress Tracking

Mark your progress as you test:

**Single User:**
- [ ] Session creation
- [ ] Feature creation
- [ ] Voting
- [ ] Results reveal
- [ ] Multiple features

**Multi-User:**
- [ ] Joining sessions
- [ ] Real-time feature creation
- [ ] Real-time voting
- [ ] Real-time results
- [ ] Consensus detection

**Edge Cases:**
- [ ] Rapid clicking
- [ ] Long names
- [ ] Special characters
- [ ] Page refresh
- [ ] Multiple tabs
- [ ] Network issues

**Devices:**
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile viewport
- [ ] Safari (if available)

## ✨ Bonus: Automated Tests

Run the full test suite:
```bash
npm run test:e2e
```

Watch tests run in UI mode:
```bash
npm run test:e2e:ui
```

This will open Playwright's test runner where you can:
- See tests execute in real-time
- Inspect each step
- Time-travel through test execution
- Debug failures easily
