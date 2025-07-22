import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string;
  ppsnNumber: string;
  citizenshipStatus: string;
}

export const SimpleProfessionalOnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    services: '',
    ppsnNumber: '',
    citizenshipStatus: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in joining our professional network. 
              We'll review your application within 2-3 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Professional Network</h1>
          <p className="text-gray-600">Start earning by providing services in your area</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="services">Services You Offer *</Label>
                <Input
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  placeholder="e.g., Plumbing, Cleaning, Handyman"
                  required
                />
              </div>

              <div>
                <Label htmlFor="citizenshipStatus">Citizenship Status *</Label>
                <Input
                  id="citizenshipStatus"
                  name="citizenshipStatus"
                  value={formData.citizenshipStatus}
                  onChange={handleChange}
                  placeholder="Irish Citizen / EU Citizen / Non-EU"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ppsnNumber">PPSN Number *</Label>
                <Input
                  id="ppsnNumber"
                  name="ppsnNumber"
                  value={formData.ppsnNumber}
                  onChange={handleChange}
                  placeholder="1234567T"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
