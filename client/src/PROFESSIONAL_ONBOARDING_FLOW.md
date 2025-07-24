# Professional Onboarding Flow - Complete Implementation

## Overview
The professional onboarding flow has been redesigned to follow a pre-approval process where professionals apply first, get approved by admin, and then create their account.

## Flow Steps

### 1. Professional Application (No Account Required)
- **Route:** `/professional/application`
- **Access:** Public - no authentication required
- **Process:**
  - Professional fills out comprehensive questionnaire
  - Collects all required information:
    - Personal details (name, DOB, email, phone)
    - Address information
    - Citizenship status and visa details (if Non-EU)
    - Services they can provide
    - Experience level, PPSN, bio
  - On submission:
    - Application saved to `professionalApplications` collection
    - Status set to 'pending'
    - Admin notification sent to genietest12345@gmail.com
    - Confirmation email sent to applicant

### 2. Admin Review
- **Admin Login:** `/admin/login` (restricted to genietest12345@gmail.com)
- **Admin Dashboard:** `/admin/professional-applications`
- **Features:**
  - View all applications with filtering by status
  - Search by name, email, phone
  - View complete application details
  - Approve or reject applications
- **On Approval:**
  - Unique signup token generated
  - Token saved in `approvedProfessionals` collection
  - Email sent to applicant with signup link
- **On Rejection:**
  - Status updated to 'rejected'
  - Rejection email sent to applicant

### 3. Professional Account Creation
- **Route:** `/professional/signup?token=UNIQUE_TOKEN`
- **Process:**
  - Token validated against `approvedProfessionals` collection
  - If valid, shows account creation form
  - Professional creates password
  - Account created with all application data
  - Token marked as used
  - Email verification sent

### 4. Professional Access
- **Login:** `/professional/login`
- **Dashboard:** `/professional/dashboard`
- **Features:**
  - Only approved professionals can access
  - Complete profile already populated from application
  - Can start accepting jobs immediately

## Key Collections

### professionalApplications
```javascript
{
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  dateOfBirth: string,
  address: { street, city, county, eircode },
  citizenship: 'irish' | 'eu' | 'non-eu',
  visaType?: string,
  visaExpiry?: string,
  services: string[],
  experience: string,
  ppsn: string,
  bio: string,
  availability?: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### approvedProfessionals
```javascript
{
  applicationId: string,
  signupToken: string,
  email: string,
  firstName: string,
  lastName: string,
  used: boolean,
  createdAt: timestamp,
  usedAt?: timestamp,
  professionalId?: string
}
```

## Routes Summary

- `/professional` - Landing page for professionals
- `/professional/application` - Application form (no auth required)
- `/professional/signup?token=XXX` - Account creation for approved applicants
- `/professional/login` - Login for existing professionals
- `/professional/dashboard` - Professional dashboard (auth required)
- `/admin/login` - Admin login
- `/admin/professional-applications` - Admin dashboard for applications

## Testing Instructions

### As a Professional:
1. Go to `/professional/application`
2. Fill out the application form
3. Submit and wait for approval email
4. Click the link in approval email
5. Create password
6. Login and access dashboard

### As Admin (genietest12345@gmail.com):
1. Go to `/admin/login`
2. Login with admin credentials
3. Go to `/admin/professional-applications`
4. Review and approve/reject applications

## Email Notifications

1. **Application Received** (to applicant)
   - Confirms application submission
   - Mentions 1-2 day review period

2. **Admin Notification** (to genietest12345@gmail.com)
   - New application alert
   - Link to review dashboard

3. **Approval Email** (to applicant)
   - Congratulations message
   - Unique signup link
   - Instructions to create account

4. **Rejection Email** (to applicant)
   - Polite rejection message
   - Option to reapply in future 