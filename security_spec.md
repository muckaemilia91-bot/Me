# Moodl Security Specification

## Data Invariants
1. A user profile can only be created/updated by the user themselves.
2. A diary entry must belong to a valid user.
3. Users can only read, create, update, or delete their own entries.
4. Challenges are read-only for users (only admins can create/update them, but for this demo they are static or global).

## The "Dirty Dozen" Payloads (Attack Vectors)
1. **Identity Spoofing**: Attempt to create a user profile with a different `uid`.
2. **PII Leak**: Attempt to read another user's private email/profile.
3. **Cross-User Entry Write**: User A attempting to write an entry to User B's `/entries` subcollection.
4. **Shadow Field Injection**: Attempt to add `isAdmin: true` to a user profile.
5. **Timestamp Fraud**: Providing a fake `createdAt` in the past.
6. **ID Poisoning**: Using a 2KB string as an entry ID.
7. **Relational Sync Break**: Creating an entry with a `userId` that doesn't match the path.
8. **Stat Tampering**: Manually increasing `streak` without a corresponding entry.
9. **Challenge Tampering**: Attempt to delete a global challenge.
10. **Resource Exhaustion**: Sending a 1MB string in the `content` field.
11. **Orphaned Write**: Creating an entry for a user that doesn't exist.
12. **Query Scraping**: Attempting to list all entries across all users.

## Access Control Logic
- `isSignedIn()`: Auth is not null.
- `isOwner(userId)`: `request.auth.uid == userId`.
- `isValidUser(data)`: Validates name, email, streak, etc.
- `isValidEntry(data)`: Validates mood, content size, userId match.
- `isValidId(id)`: Regex and size check.
