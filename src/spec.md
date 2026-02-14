# Specification

## Summary
**Goal:** Fix the publish flow so authenticated Internet Identity users can publish successfully, with clearer error messaging and immediate feed updates after a successful publish.

**Planned changes:**
- Update backend authorization logic in `uploadArticle(article)` to allow authenticated Internet Identity users to publish while blocking anonymous callers with a clear authorization error.
- Improve Publish Content page error handling to display the actual backend error message when available (fallback to a generic message only when needed) and keep the form usable after failures.
- Ensure publish success UI is shown only after the upload mutation truly succeeds, and refresh/refresh-trigger article feeds (Home/News) so newly published articles appear immediately without a hard reload.

**User-visible outcome:** Signed-in users can publish content successfully; if publishing fails the UI shows a meaningful error message; after a successful publish the new article appears in Home/News right away and the success confirmation only appears on true success.
