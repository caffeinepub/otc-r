# Specification

## Summary
**Goal:** Simplify the posting flow so authenticated user uploads are published immediately, removing all moderation/admin approval workflow from backend and frontend.

**Planned changes:**
- Backend: remove Pending/Approved/Rejected submission state and all ArticleSubmission-based moderation storage/logic; store uploads directly as published Articles.
- Backend: update/repurpose the upload canister method to publish immediately while still rejecting anonymous callers (Internet Identity required).
- Backend: remove admin-only authorization gates related to publishing and article queries so Home/News and search return all published articles without role checks.
- Frontend: remove moderation/admin React Query hooks and API usage; update the upload mutation to publish immediately and invalidate/refetch article list queries so new posts appear right away.
- Frontend: update the Upload page to remove pending/approval language and any `pending` status payload fields; show a “published” confirmation after successful upload.
- Frontend: remove/disable admin-only moderation UI, routes, and navigation entry points (e.g., admin approval/upload screens), while keeping the existing header search bar and upload button unchanged.

**User-visible outcome:** Signed-in users can upload a post and see it appear immediately in Home/News feeds and search results, with no admin approval, pending states, or admin moderation screens exposed in the UI.
