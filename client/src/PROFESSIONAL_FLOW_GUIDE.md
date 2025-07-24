# Professional Onboarding Flow Guide

## Complete Flow Overview

### 1. Professional Registration
- **Route:** `/professional/register`
- **Process:**
  - Professional creates account with email and password
  - Basic profile is created with status: 'pending'
  - Email verification is sent
  - After email verification, redirected to onboarding questionnaire

### 2. Onboarding Questionnaire
- **Route:** `/professional/onboarding`
- **Required Fields:**
  - Personal Details: Name, DOB, Email, Phone
  - Address: Street, City, County, Eircode
  - Citizenship Status: Irish/EU/Non-EU
  - Visa Type (if Non-EU): Stamp 1G, Stamp 1, Stamp 2, Stamp 4, etc.
  - Services Offered:
    - Cleaning & Pest Control
    - Beauty & Wellness
    - IT Services
  - PPSN Number
  - Experience Level
- **On Submission:**
  - Profile updated with all details
  - Status remains 'pending'
  - Admin notification email sent to genietest12345@gmail.com
  - Confirmation email sent to professional

### 3. Admin Review Process
- **Admin Login Route:** `/admin/login`
- **Admin Dashboard Route:** `/admin/professional-approval`
- **Admin Access:** genietest12345@gmail.com
- **Features:**
  - View all professional applications
  - Filter by status (pending/approved/rejected)
  - Search by name, email, phone, services
  - View complete application details
  - Approve or Reject applications
- **On Decision:**
  - Approval: Email sent to professional with login instructions
  - Rejection: Email sent to professional with rejection notice

### 4. Professional Access
- **Login Route:** `/professional/login`
- **Dashboard Route:** `/professional/dashboard`
- **Access Control:**
  - Only approved professionals can access dashboard
  - Pending applications see "under review" message
  - Rejected applications see rejection message

## Testing the Flow

### As a Professional:
1. Go to `/professional` to see the landing page
2. Click "Sign Up as Professional" → `/professional/register`
3. Create account and verify email
4. Complete questionnaire at `/professional/onboarding`
5. Wait for admin approval

### As Admin:
1. Go to `/admin/login`
2. Login with genietest12345@gmail.com credentials
3. Access dashboard at `/admin/professional-approval`
4. Review and approve/reject applications

## Email Notifications

1. **After Registration:** Verification email to professional
2. **After Questionnaire Submission:**
   - Admin notification to genietest12345@gmail.com
   - Confirmation to professional: "Application received, review in 1-2 days"
3. **After Admin Decision:**
   - Approval: "Congratulations! Login at /professional/login"
   - Rejection: "Application rejected, contact support"

## API Endpoints Required

The following server endpoints need to be implemented:
- `/api/professional/admin-notification` - Send admin notification
- `/api/professional/confirmation-email` - Send confirmation to professional
- `/api/professional/approval-email` - Send approval notification
- `/api/professional/rejection-email` - Send rejection notification

## Security Features

- Email verification required
- Admin access restricted to genietest12345@gmail.com
- Professional dashboard access only after approval
- Secure Firebase authentication
- Role-based access control 