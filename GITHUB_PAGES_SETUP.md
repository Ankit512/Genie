# GitHub Pages Setup Guide

This guide explains how to set up GitHub Pages to automatically deploy the latest version of your Genie application.

## 🚀 Automatic Deployment

Your GitHub Pages deployment is configured to automatically trigger on every push to the `master` branch. The deployment workflow is located at `.github/workflows/deploy.yml`.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **GitHub Pages Enabled**: Pages must be enabled in your repository settings
3. **Environment Variables**: Firebase configuration needs to be set up

## ⚙️ Setting Up Environment Variables

### For GitHub Pages Deployment

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Update the Deployment Workflow

The workflow will automatically use these secrets during the build process. The current workflow includes:

- Node.js 18 setup
- Dependency installation
- Production build
- GitHub Pages deployment
- Deployment status reporting

## 🔄 Manual Deployment

If you need to manually trigger a deployment:

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select **Deploy Genie to GitHub Pages**
4. Click **Run workflow** → **Run workflow**

## 📍 Your Site URL

Your GitHub Pages site will be available at:
```
https://your-username.github.io/Genie/
```

## 🔧 Troubleshooting

### Build Failures

1. **Check Actions Logs**: Go to Actions tab and check the latest workflow run
2. **Environment Variables**: Ensure all Firebase environment variables are set
3. **Dependencies**: Make sure all dependencies are properly installed

### Site Not Updating

1. **Check Deployment Status**: Look for the green checkmark in Actions
2. **Clear Browser Cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. **Check Base URL**: Ensure Vite config has correct base path

### Firebase Issues

1. **API Key Restrictions**: Make sure your Firebase API key allows GitHub Pages domain
2. **Authorized Domains**: Add `your-username.github.io` to Firebase authorized domains
3. **Environment Variables**: Verify all Firebase config variables are set correctly

## 📝 Current Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Base Path**: `/Genie/`
- **Node Version**: 18
- **Auto-deploy**: On every push to master

## 🎯 Best Practices

1. **Test Locally**: Always test your build locally before pushing
2. **Environment Variables**: Never commit sensitive keys to the repository
3. **Branch Protection**: Consider protecting the master branch
4. **Monitoring**: Check deployment status after each push

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup) 