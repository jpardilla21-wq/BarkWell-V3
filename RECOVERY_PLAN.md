# 🚑 Project Recovery Plan & Roadmap

**Status:** Critical / Recovery Mode
**Date:** 2026-01-08
**Based on:** Build Analysis Report

## 🔍 Phase 0: The "Missing Code" Hunt (Immediate Action)

Before writing any new code for Phase 5 (Analytics) or Phase 6 (Referrals), we must determine if the "lost" code can be recovered.

**Action Items for the User:**
1.  **Check Local Machines:** The code likely resides on the local file system of the machine where "Claude" was previously running. Search for folders named `pupsense` or `claude_code` on your personal/work laptop.
2.  **Check Git Reflogs:** On your local machine, run `git reflog` to see if there are "dangling commits" that were never pushed to the remote `main` branch.
3.  **Check Other Remotes:** Run `git remote -v` to see if there is a different `origin` (e.g., a Replit container vs. GitHub) where the code was pushed.

*Decision Point:*
*   **If Found:** Copy the files for `backend/routes/analytics.js` and `screens/ReferralScreen.tsx` (etc.) into this repo and commit immediately.
*   **If NOT Found:** We must accept the data loss and schedule these features for **Phase 4** of this plan.

---

## 🛠 Phase 1: Stabilization (Week 1)

**Goal:** Get the build green. The app must compile and the server must not crash.

### 1.1 Fix Mobile Build (Priority: Critical)
*   **Task:** Fix TypeScript errors in `screens/BehaviorCheckScreen.tsx`.
    *   *Fix:* Define the missing `BehaviorState` types.
    *   *Fix:* Remove or rename the invalid `backgroundDark` theme property usage.
*   **Task:** Verify all screens import correctly in `RootNavigator`.

### 1.2 Fix Backend Stability (Priority: High)
*   **Task:** Patch `backend/server.js`.
    *   *Fix:* Ensure the `server` instance is correctly assigned to a variable accessible by the `SIGTERM` handler to prevent `ReferenceError` during shutdown.

### 1.3 Smoke Testing
*   **Task:** Create a `scripts/verify-build.sh` script that:
    1.  Installs dependencies.
    2.  Runs TypeScript compiler (`tsc`).
    3.  Starts/Stops the backend server to prove stability.

---

## 🚀 Phase 2: Mobile Parity (Weeks 2-3)

**Goal:** Bring the Mobile App up to "Phase 3" specification (Monetization).

### 2.1 Subscription System Repair
*   **Current State:** Hardcoded $2.99/$9.99 (Legacy).
*   **Target State:** Dynamic fetch from API.
*   **Tasks:**
    1.  Create `frontend/services/api.ts` (Mobile version) to call `GET /api/subscriptions/tiers`.
    2.  Update `SubscriptionScreen.tsx` to render the "Plus" ($4.99) and "Pro" ($9.99) cards dynamically.
    3.  Implement the "Upgrade" button to call `POST /api/subscriptions/subscribe`.

### 2.2 Implement Shop Tab
*   **Current State:** Missing.
*   **Tasks:**
    1.  Create `screens/ShopScreen.tsx`.
    2.  Implement `FlatList` to display products from `GET /api/shop/products`.
    3.  Add "Affiliate Click" handling (open URL in browser + call `POST /api/shop/track-click`).
    4.  Add `ShopTab` to `MainTabNavigator`.

### 2.3 Implement Insurance Cards
*   **Current State:** Missing.
*   **Tasks:**
    1.  Create `components/InsuranceCard.tsx`.
    2.  Fetch partners from `GET /api/shop/insurance`.
    3.  Inject this card into `WellnessDashboard` (Home Screen).

---

## 🛡 Phase 3: Quality Assurance Foundation (Week 3)

**Goal:** Stop the "Fake Status" problem.

### 3.1 Backend Tests
*   **Action:** Install `jest` and `supertest`.
*   **Scope:**
    *   Test 1: `GET /api/health` returns 200.
    *   Test 2: `GET /api/subscriptions/tiers` returns exactly 3 tiers.
    *   Test 3: `POST /api/subscriptions/subscribe` validates inputs.

### 3.2 Mobile Tests
*   **Action:** Install `jest-expo`.
*   **Scope:**
    *   Snapshot test for `SubscriptionScreen`.
    *   Unit test for `api.ts` services.

---

## 🔮 Phase 4: Future Features (Week 4+)

**Goal:** Implement the "Lost" Phase 5 & 6 features (if not recovered).

### 4.1 Analytics (Phase 5)
*   **Plan:** Integrate PostHog or Mixpanel (better than custom SQL implementation).
*   **Backend:** Add event tracking middleware.

### 4.2 User Referrals (Phase 6)
*   **Plan:** Generate unique invite codes (e.g., `JOHND-123`) for every user.
*   **Database:** Add `referrals` table.
*   **UI:** Create `InviteFriendsScreen`.

---

## 📝 Summary of Recommendations

1.  **Do NOT** start Phase 5/6 coding yet. Fix the broken foundation first.
2.  **IMMEDIATELY** search for the lost code locally.
3.  **Authorize** the "Stabilization" phase to fix the build errors.
