import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminDashboard } from '@/components/admin';

export function AdminTestPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // Mock credentials for testing
  const mockCredentials = {
    username: 'admin@genie.com',
    password: 'admin123'
  };

  const handleLogin = () => {
    if (credentials.username === mockCredentials.username && 
        credentials.password === mockCredentials.password) {
      setShowDashboard(true);
    } else {
      alert('Invalid credentials! Use admin@genie.com / admin123');
    }
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setCredentials({ username: '', password: '' });
  };

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-background"
          >
            Logout (Test Mode)
          </Button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Dashboard Test</CardTitle>
          <p className="text-muted-foreground">Login to test the admin dashboard</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Email</label>
            <Input
              id="username"
              type="email"
              placeholder="Enter email"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full"
          >
            Login to Dashboard
          </Button>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-sm mb-2">Test Credentials:</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> admin@genie.com<br />
              <strong>Password:</strong> admin123
            </p>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Back to Main Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 