# Firebase API Key Troubleshooting

## Current Issue
Getting 403 error: "Requests from referer https://genie-e3e74.firebaseapp.com/ are blocked"

## Immediate Solutions to Try:

### 1. **Temporarily Remove API Key Restrictions** (Quick Test)
1. Go to https://console.cloud.google.com
2. Select your project: genie-e3e74
3. Go to **APIs & Services** → **Credentials**
4. Click on your Browser API key
5. Under **Application restrictions**, select **None**
6. Click **Save**
7. Test registration again

### 2. **Clear Browser Cache Completely**
- **Chrome**: Settings → Privacy and security → Clear browsing data → All time
- **Firefox**: Settings → Privacy & Security → Clear Data → Clear
- **Safari**: Develop → Empty Caches

### 3. **Use Different Browser/Incognito**
- Open http://localhost:5173 in an incognito/private window
- This bypasses all cached data

### 4. **Check Firebase Console Settings**
1. Go to Firebase Console → Authentication → Settings
2. Under **Authorized domains**, make sure these are listed:
   - `localhost`
   - `genie-e3e74.firebaseapp.com`
   - `genie-e3e74.web.app`

### 5. **Alternative: Use Firebase Auth Emulator** (For Development)
If the above doesn't work, we can set up Firebase Auth Emulator for local development.

## Root Cause
Firebase Auth is redirecting through `genie-e3e74.firebaseapp.com` even when accessing from localhost, and the API key restrictions are blocking this redirect.

## Next Steps
Try solution #1 first (remove restrictions temporarily) to confirm this is the issue. 