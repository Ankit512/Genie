# Environment Variables Setup for Professional Firebase

## Create `.env.local` file

Create a new file called `.env.local` in the `/client` directory and add these environment variables:

```bash
# Professional Firebase Configuration (Separate from Customer)
VITE_PROFESSIONAL_FIREBASE_API_KEY=AIzaSyA7TXggnunbPoSMkxdJJEt_BsFemjv0ssA
VITE_PROFESSIONAL_FIREBASE_AUTH_DOMAIN=genie-pro-4ecbd.firebaseapp.com
VITE_PROFESSIONAL_FIREBASE_PROJECT_ID=genie-pro-4ecbd
VITE_PROFESSIONAL_FIREBASE_STORAGE_BUCKET=genie-pro-4ecbd.firebasestorage.app
VITE_PROFESSIONAL_FIREBASE_MESSAGING_SENDER_ID=616039965111
VITE_PROFESSIONAL_FIREBASE_APP_ID=1:616039965111:web:25610378d17b5ae9ea8832

# Keep your existing customer Firebase variables (if any)
# VITE_FIREBASE_API_KEY=your_customer_firebase_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_customer_project.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=your_customer_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_customer_project.appspot.com
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_customer_messaging_sender_id
# VITE_FIREBASE_APP_ID=your_customer_app_id
```

## Next Steps After Creating .env.local

1. **Restart your development server** after adding the environment variables
2. **Enable Authentication** in Firebase Console (if not done yet)
3. **Set up Firestore security rules**
4. **Test professional authentication**

## Commands to run:

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
cd /Users/ankit/Documents/Genie/client
npm run dev
```
