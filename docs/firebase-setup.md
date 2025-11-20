# Firebase Setup Guide for Focus OS

## Prerequisites
1. Google Account
2. Node.js 16+ installed
3. Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "focus-os-studyverse" or similar
4. Enable Google Analytics (recommended)
5. Choose default account for Firebase features

## Step 2: Enable Required Services

### Authentication
1. In Firebase console → Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google (for social login)
4. Optional: Enable Anonymous (for guest users)

### Firestore Database
1. Go to Firestore Database → Create database
2. Choose "Start in test mode" (we'll secure it later)
3. Select region closest to your users
4. Wait for database creation

### Storage (for file uploads)
1. Go to Storage → Get started
2. Choose "Start in test mode"
3. Select same region as Firestore

## Step 3: Get Configuration Keys

1. Go to Project settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon to add web app
4. Register app with nickname "Focus OS Web"
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

## Step 4: Update Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

## Step 5: Security Rules

### Firestore Security Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents to any user signed in to the application
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // More specific rules for production:
    match /artifacts/focus-os-studyverse/public/data/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
    
    match /artifacts/focus-os-studyverse/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules
In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // More specific rules for user uploads
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Test Connection

Run the development server:
```bash
npm run dev
```

Open browser console and check for Firebase connection. You should see the authentication working.

## Step 7: Initialize Firebase CLI (Optional)

For deployment and advanced features:

```bash
# Login to Firebase
firebase login

# Initialize project
firebase init

# Choose:
# - Firestore
# - Hosting
# - Storage
# - Functions (if needed)

# Select existing project
# Use default settings for most prompts
```

## Production Considerations

### 1. Enable App Check (Recommended)
Protects against abuse by verifying requests come from your app.

### 2. Set up monitoring
Enable crash reporting and performance monitoring.

### 3. Configure quota limits
Set spending limits to avoid unexpected costs.

### 4. Backup strategy
Set up automated backups for Firestore.

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure domain is added in Firebase Authentication settings
2. **Permission denied**: Check Firestore security rules
3. **Quota exceeded**: Monitor usage in Firebase console
4. **API key errors**: Verify all environment variables are correct

### Debug commands:
```bash
# Check Firebase CLI version
firebase --version

# View current project
firebase projects:list

# Test Firestore rules locally
firebase emulators:start --only firestore
```

Your Firebase setup is now complete! The app should connect automatically when you run `npm run dev`.