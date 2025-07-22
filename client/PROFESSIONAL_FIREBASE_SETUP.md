# Professional Firebase Setup

This document outlines the separate Firebase configuration required for the professional portal to ensure complete isolation from the customer authentication system.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

### Professional Firebase Configuration
```bash
# Professional Firebase Project (Separate from Customer)
VITE_PROFESSIONAL_FIREBASE_API_KEY=your_professional_firebase_api_key
VITE_PROFESSIONAL_FIREBASE_AUTH_DOMAIN=genie-professionals.firebaseapp.com
VITE_PROFESSIONAL_FIREBASE_PROJECT_ID=genie-professionals
VITE_PROFESSIONAL_FIREBASE_STORAGE_BUCKET=genie-professionals.appspot.com
VITE_PROFESSIONAL_FIREBASE_MESSAGING_SENDER_ID=your_professional_messaging_sender_id
VITE_PROFESSIONAL_FIREBASE_APP_ID=your_professional_app_id
```

### Customer Firebase Configuration (Existing)
```bash
# Customer Firebase Project (Keep Existing)
VITE_FIREBASE_API_KEY=your_customer_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_customer_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_customer_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_customer_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_customer_messaging_sender_id
VITE_FIREBASE_APP_ID=your_customer_app_id
```

## Firebase Project Setup Steps

### 1. Create New Professional Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Genie Professionals" or similar
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google sign-in
4. Configure authorized domains (localhost, your production domain)

### 3. Create Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules for professionals collection

### 4. Get Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Web app" icon to add web app
4. Copy the configuration values
5. Add to your `.env.local` file with `VITE_PROFESSIONAL_` prefix

## Firestore Security Rules

Add these rules to your professional Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Professionals collection - users can only access their own data
    match /professionals/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications collection - for admin review
    match /applications/{applicationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.professionalId || 
         request.auth.token.admin == true);
    }
  }
}
```

## Key Benefits of Separate Firebase Setup

1. **Complete Data Isolation**: Professional and customer data never mix
2. **Independent Scaling**: Each system can scale independently
3. **Security**: Separate authentication systems reduce attack surface
4. **Compliance**: Easier to manage different compliance requirements
5. **Development**: Teams can work on professional/customer features independently
6. **Backup & Recovery**: Independent backup strategies for each system

## Implementation Details

- Professional authentication uses `firebase-professional.ts`
- Professional context uses `ProfessionalAuthContext.tsx`
- Professional components import from professional-specific modules
- No shared authentication state between customer and professional portals
- Separate user collections: `users` (customers) vs `professionals`
- Separate application flows and business logic

## Testing

1. Create test professional account in new Firebase project
2. Verify professional login/logout works independently
3. Confirm customer authentication still works with existing Firebase
4. Test that professional data doesn't appear in customer Firebase
5. Verify email verification works for professional accounts
