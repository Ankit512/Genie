# Testing the Admin Dashboard

## 🚀 Quick Start

### Method 1: Direct URL Access (Recommended)
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/admin-test
   ```

3. Use these test credentials:
   - **Email:** `admin@genie.com`
   - **Password:** `admin123`

### Method 2: Through Provider Authentication
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/register`

3. Create a provider account:
   - Choose "Service Provider" as account type
   - Complete the registration

4. After registration, you'll be redirected to `/provider` which now shows the admin dashboard

## 🎯 Features to Test

### Dashboard Overview
- View summary statistics (bookings, earnings, performance)
- Check notification system
- Test quick action buttons

### Bookings Management
- Switch between booking status tabs (All, Pending, Accepted, Completed)
- Try accepting/rejecting pending bookings
- Test marking jobs as complete
- Check customer contact information

### Calendar View
- Navigate between months
- Click on dates to view scheduled events
- Check color-coded booking statuses

### Earnings & Payments
- View earning statistics
- Filter payment history by date
- Check payout settings

### Profile Management
- Edit professional information
- Manage services and service areas
- Update availability schedule
- Add/remove certifications

## 📊 Sample Data

The dashboard includes realistic mock data:
- **3 sample bookings** with different statuses
- **Professional profile** (John Smith, Plumber)
- **Earnings history** and payment records
- **Recent notifications**

## 🔧 Development Testing

### Adding New Features
1. All components are in `/src/components/admin/`
2. Mock data is in `/src/components/admin/services/mockDataService.ts`
3. Types are defined in `/src/components/admin/types/index.ts`

### Backend Integration
Replace `MockDataService` with your actual API:
```typescript
// Current
const bookings = await MockDataService.getBookings();

// Replace with
const bookings = await YourAPIService.getBookings();
```

## 🔍 Troubleshooting

### Common Issues
- If components don't load, check console for import errors
- If styles look wrong, ensure Tailwind CSS is properly configured
- If API calls fail, verify the mock data service is working

### Dependencies
Required packages (already installed):
- `@radix-ui/react-tabs`
- `class-variance-authority`
- `lucide-react`
- `tailwindcss`

## 💡 Tips

1. **Mobile Testing**: The dashboard is fully responsive - test on different screen sizes
2. **Interactive Elements**: All buttons and forms are functional with mock data
3. **Real-time Updates**: Status changes update immediately in the UI
4. **Navigation**: Use the sidebar to switch between different sections

Enjoy testing the admin dashboard! 🎉 