# Firebase Email Verification Setup Guide

## Problem
Email verification links are expiring immediately because Firebase is not configured to handle the custom verification URL properly.

## Solution Implemented

1. **Created Email Verification Handler Page** (`client/src/pages/EmailVerificationPage.tsx`)
   - Handles Firebase action codes from email links
   - Processes `verifyEmail` mode with `oobCode` parameter
   - Shows success/error states with appropriate messaging

2. **Updated Email Verification Configuration**
   - Modified `sendEmailVerification` to include custom action code settings
   - Set `handleCodeInApp: true` to handle verification in the app
   - URL points to `/verify-email` route

3. **Added Route** in `App.tsx`
   - `/verify-email` route to handle verification links

## Required Firebase Console Configuration

To complete the setup, you need to configure Firebase Authentication settings:

### 1. Update Email Action Handler URL

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (genie-e3e74)
3. Navigate to **Authentication** → **Templates**
4. Click on **Email address verification**
5. Click the pencil icon to edit
6. In the action URL field, update it to include your domain:
   - For development: `http://localhost:5173/verify-email`
   - For production: `https://yourdomain.com/verify-email`

### 2. Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Under **Authorized domains**, add:
   - `localhost` (for development)
   - Your production domain

### 3. Customize Email Template (Optional)

1. In **Authentication** → **Templates** → **Email address verification**
2. You can customize:
   - Subject line
   - Sender name
   - Message content
   - Keep the `%LINK%` placeholder for the verification link

### 4. Set Email Link Expiration (Optional)

By default, Firebase email verification links expire after 1-3 hours. To adjust:
1. This is controlled by Firebase and cannot be directly configured
2. Best practice: Implement a "Resend verification email" feature (already implemented)

## Testing the Implementation

1. Register a new user
2. Check email for verification link
3. Click the link - it should redirect to `/verify-email?mode=verifyEmail&oobCode=...`
4. The page will process the verification and show success/error message
5. User can then log in with verified email

## Troubleshooting

### Link Still Showing as Expired
- Ensure the Firebase Console email template is using the correct action URL
- Check that the domain is in the authorized domains list
- Verify the `oobCode` is being passed correctly in the URL

### Email Not Sending
- Check Firebase project has email verification enabled
- Verify SMTP settings in Firebase (uses Firebase's default email service)
- Check spam folder

### Custom Domain Issues
- Ensure your domain is verified in Firebase Console
- Update CORS settings if needed
- Check that HTTPS is enabled for production

## Server Setup Requirements

The server also needs Firebase Admin SDK credentials to run:

### 1. Generate Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely

### 2. Configure Server Environment
Create a `server/.env` file with:

```bash
# Option 1: Inline JSON (be careful with escaping)
FIREBASE_ADMIN_SA='{"type":"service_account","project_id":"genie-e3e74",...}'

# Option 2: File path
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json

# Other required variables
FIREBASE_DATABASE_URL=https://genie-e3e74.firebaseio.com
FIREBASE_STORAGE_BUCKET=genie-e3e74.appspot.com
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Never Commit Credentials
- Keep service account keys secure
- Never commit them to version control
- Use environment variables or secure key management 