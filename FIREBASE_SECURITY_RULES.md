# Firebase Security Rules for Shared Workspace

## Overview
The app now uses two data storage locations:
1. **User Workspace** (`users/{userId}/userData`) - Private journal data
2. **Shared Workspace** (`shared/ashlyn_retreat`) - Shared business tools

## Required Security Rules

Update your Firebase Realtime Database rules to:

```json
{
  "rules": {
    "users": {
      "$uid": {
        "userData": {
          // User-specific data (journals, letters to future self)
          // Only the owner can read/write
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid"
        }
      }
    },
    "shared": {
      "ashlyn_retreat": {
        // Shared workspace for business tools
        // Any authenticated user can read/write
        // In production, you might want to restrict to specific user IDs
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

## Deploying Security Rules

### Option 1: Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project: **ashlyn-retreat**
3. Navigate to **Realtime Database** → **Rules**
4. Replace the existing rules with the rules above
5. Click **Publish**

### Option 2: Firebase CLI
1. Update the `database.rules.json` file in your project
2. Run: `firebase deploy --only database`

## Enhanced Security (Optional)

For production use with specific users:

```json
{
  "rules": {
    "users": {
      "$uid": {
        "userData": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid"
        }
      }
    },
    "shared": {
      "ashlyn_retreat": {
        // Restrict to specific retreat participants
        ".read": "auth != null && (
          auth.email == 'dillynraney@gmail.com' ||
          auth.email == 'ashlee@example.com'
        )",
        ".write": "auth != null && (
          auth.email == 'dillynraney@gmail.com' ||
          auth.email == 'ashlee@example.com'
        )"
      }
    }
  }
}
```

## Data Structure

### User Workspace
```
users/
  {userId}/
    userData/
      ashlyn_retreat_dillyn_journals/
        data: { daily: {}, freeform: [], futureLetter: {} }
        updatedAt: timestamp
      ashlyn_retreat_ashlee_journals/
        data: { daily: {}, freeform: [], futureLetter: {} }
        updatedAt: timestamp
      ashlyn_retreat_preferences/
        data: { currentUser: "Dillyn" }
        updatedAt: timestamp
```

### Shared Workspace
```
shared/
  ashlyn_retreat/
    ashlyn_retreat_supplies/
      data: { checked: {}, custom: [] }
      updatedAt: timestamp
      updatedBy: "user@example.com"
    ashlyn_retreat_swot/
      data: { analyses: [] }
      updatedAt: timestamp
      updatedBy: "user@example.com"
    ashlyn_retreat_ikigai/
      data: { love: "", goodAt: "", paidFor: "", worldNeeds: "" }
      updatedAt: timestamp
      updatedBy: "user@example.com"
    ashlyn_retreat_value_prop/
      data: { customerJobs: "", pains: "", gains: "", ... }
      updatedAt: timestamp
      updatedBy: "user@example.com"
    ashlyn_retreat_kanban/
      data: { develop: [], ready: [], parking: [] }
      updatedAt: timestamp
      updatedBy: "user@example.com"
    ashlyn_retreat_action_plan/
      data: { businessIdea: "", vision: "", months: {} }
      updatedAt: timestamp
      updatedBy: "user@example.com"
```

## Testing Security Rules

After deploying:
1. Log in as a user
2. Check console logs for "Saved to shared workspace" or "Saved to user workspace"
3. Try accessing shared tools - both users should see the same data
4. Try accessing journals - each user should only see their own

## Migration

The app includes a migration button in the sync status bar:
- Click "Migrate to Shared" to move existing business tools to shared workspace
- Journals automatically remain in user workspace
- Safe to run multiple times (idempotent)
