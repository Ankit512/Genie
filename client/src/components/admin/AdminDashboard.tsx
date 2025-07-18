import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  Users, 
  DollarSign, 
  User, 
  Bell, 
  Settings,
  Menu,
  X
} from 'lucide-react';

// Import our dashboard components
import { DashboardOverview } from './components/DashboardOverview';
import { BookingsManagement } from './components/BookingsManagement';
import { CalendarView } from './components/CalendarView';
import { EarningsPayments } from './components/EarningsPayments';
import { ProfileManagement } from './components/ProfileManagement';

type ActiveView = 'dashboard' | 'bookings' | 'calendar' | 'earnings' | 'profile';

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Users, badge: 3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'bookings':
        return <BookingsManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'earnings':
        return <EarningsPayments />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 bottom-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">G</span>
            </div>
            <h1 className="text-xl font-bold leading-none">Genie Pro</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation - Takes remaining space */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start relative"
                  onClick={() => {
                    setActiveView(item.id as ActiveView);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto bg-orange-100 text-orange-800"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </nav>

        {/* Professional Info - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Smith</p>
              <p className="text-xs text-muted-foreground truncate">Professional Plumber</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen lg:mt-16">
        {/* Top bar - Mobile only */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background border-b border-border lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">
            {menuItems.find(item => item.id === activeView)?.label}
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
} 