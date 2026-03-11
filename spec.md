# LALU Private Chat

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Password-protected login page (pink/romantic theme, password: lalu123)
- Private chat page shown after successful login
- Chat messages stored in backend
- Logout button

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: store chat messages (text, timestamp, sender name)
- Frontend: login page with password input, chat page with message list and send form
- Login uses hardcoded password check (lalu123), client-side gate to chat view
- Pink romantic theme matching original HTML design
