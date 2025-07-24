import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { sendProfessionalApplicationNotification } from '@/lib/admin-notifications';

interface ApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address
  street: string;
  city: string;
  county: string;
  eircode: string;
  
  // Citizenship & Visa
  citizenship: 'irish' | 'eu' | 'non-eu';
  visaType?: string;
  visaExpiry?: string;
  
  // Professional Information
  services: string[];
  experience: string;
  ppsn: string;
  
  // Additional
  bio: string;
  availability: string;
}

const SERVICE_CATEGORIES = {
  'Cleaning & Pest Control': [
    'Full home cleaning (1-2 rooms)',
    'Bathroom/kitchen deep clean',
    'Insta Help (quick hourly tasks like mopping)'
  ],
  'Beauty & Wellness': [
    'Haircut/grooming',
    'Massage (basic/full body)',
    'Facial/manicure'
  ],
  'IT Services': [
    'Device setup/troubleshooting (phones/computers)',
    'WiFi/network fixes',
    'Software installs/updates'
  ]
};

const VISA_TYPES = [
  'Stamp 1',
  'Stamp 1G',
  'Stamp 2',
  'Stamp 2A',
  'Stamp 3',
  'Stamp 4',
  'Stamp 5',
  'Stamp 6'
];

export function ProfessionalApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    street: '',
    city: '',
    county: '',
    eircode: '',
    citizenship: 'irish',
    visaType: '',
    visaExpiry: '',
    services: [],
    experience: '',
    ppsn: '',
    bio: '',
    availability: ''
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && 
                 formData.phone && formData.dateOfBirth);
      case 2:
        return !!(formData.street && formData.city && formData.county && formData.eircode);
      case 3:
        if (formData.citizenship === 'non-eu') {
          return !!(formData.visaType && formData.visaExpiry);
        }
        return true;
      case 4:
        return !!(formData.services.length > 0 && formData.experience && 
                 formData.ppsn && formData.bio);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save application to Firestore
      const applicationRef = await addDoc(collection(db, 'professionalApplications'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Send notification emails
      await sendProfessionalApplicationNotification(
        formData.email,
        formData.firstName,
        applicationRef.id
      );

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Application Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you for applying to join Genie as a professional service provider.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800">
                <strong>What happens next:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• We'll review your application within 1-2 business days</li>
                <li>• You'll receive an email at <strong>{formData.email}</strong></li>
                <li>• If approved, you'll get a unique sign-up link</li>
                <li>• Use that link to create your account and access your dashboard</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Professional Application</h1>
          <p className="text-gray-600 mt-2">Join Genie as a service provider</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 ${step < 4 ? 'mr-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Personal Info</span>
            <span>Address</span>
            <span>Citizenship</span>
            <span>Professional</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+353 87 123 4567"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h2>

                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dublin"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Input
                      id="county"
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      placeholder="Dublin"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="eircode">Eircode *</Label>
                  <Input
                    id="eircode"
                    name="eircode"
                    value={formData.eircode}
                    onChange={handleInputChange}
                    placeholder="D02 X285"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Citizenship & Visa */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Citizenship & Work Authorization
                </h2>

                <div>
                  <Label htmlFor="citizenship">Citizenship Status *</Label>
                  <select
                    id="citizenship"
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="irish">Irish Citizen</option>
                    <option value="eu">EU Citizen</option>
                    <option value="non-eu">Non-EU Citizen</option>
                  </select>
                </div>

                {formData.citizenship === 'non-eu' && (
                  <>
                    <div>
                      <Label htmlFor="visaType">Visa Type *</Label>
                      <select
                        id="visaType"
                        name="visaType"
                        value={formData.visaType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select visa type</option>
                        {VISA_TYPES.map(visa => (
                          <option key={visa} value={visa}>{visa}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="visaExpiry">Visa Expiry Date *</Label>
                      <Input
                        id="visaExpiry"
                        name="visaExpiry"
                        type="date"
                        value={formData.visaExpiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Professional Information */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h2>

                <div>
                  <Label>Services You Can Provide *</Label>
                  <div className="mt-2 space-y-4">
                    {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-gray-700">{category}</h4>
                        <div className="space-y-2">
                          {services.map(service => (
                            <label
                              key={service}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.services.map(service => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="ppsn">PPSN Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="ppsn"
                      name="ppsn"
                      value={formData.ppsn}
                      onChange={handleInputChange}
                      placeholder="1234567T"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your experience and skills..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    placeholder="e.g., Weekdays 9am-5pm, Weekends"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 