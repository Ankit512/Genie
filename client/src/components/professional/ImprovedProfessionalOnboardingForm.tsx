import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Globe, 
  Briefcase,
  Mail,
  AlertCircle
} from 'lucide-react';
import { createProfessionalProfile, sendProfessionalEmailVerification } from '@/lib/firebase-professional';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { serverTimestamp } from 'firebase/firestore';
import { sendAdminNotificationEmail, sendApplicationConfirmationEmail } from '@/lib/admin-notifications';

interface FormData {
  // Personal Details (Page 1)
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
  
  // Citizenship & Work Authorization
  citizenship: string;
  visaType: string;
  
  // Professional Details (Page 2)
  services: string[];
  ppsn: string;
  experience: string;
  qualifications: string[];
  certifications: string;
  previousEmployment: string;
  references: string;
  
  // About Me & Availability (Page 3)
  aboutMe: string;
  workingHours: string[];
  availability: string;
  transportMode: string;
  coverageAreas: string[];
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo: string;
}

const CITIZENSHIP_OPTIONS = [
  'Irish Citizen',
  'EU Citizen',
  'Non-EU (Work Visa Required)'
];









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

export function ImprovedProfessionalOnboardingForm() {
  const { user } = useProfessionalAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    // Personal Details (Page 1)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    street: '',
    city: '',
    county: '',
    eircode: '',
    citizenship: '',
    visaType: '',
    
    // Professional Details (Page 2)
    services: [],
    ppsn: '',
    experience: '',
    qualifications: [],
    certifications: '',
    previousEmployment: '',
    references: '',
    
    // About Me & Availability (Page 3)
    aboutMe: '',
    workingHours: [],
    availability: '',
    transportMode: '',
    coverageAreas: [],
    emergencyContact: '',
    emergencyPhone: '',
    additionalInfo: ''
  });

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };







  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Personal details validation
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    
    // Address validation
    if (!formData.street.trim()) errors.push('Street address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.county.trim()) errors.push('County is required');
    if (!formData.eircode.trim()) errors.push('Eircode is required');
    
    // Citizenship validation
    if (!formData.citizenship) errors.push('Citizenship status is required');
    if (formData.citizenship === 'Non-EU (Work Visa Required)' && !formData.visaType.trim()) {
      errors.push('Visa type is required for non-EU citizens');
    }
    
    // Professional details validation
    if (formData.services.length === 0) errors.push('At least one service must be selected');
    if (!formData.ppsn.trim()) errors.push('PPSN is required');
    if (!formData.experience) errors.push('Experience level is required');
    
    // Age validation (must be 18+)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) errors.push('You must be at least 18 years old to register');
    
    // PPSN format validation (basic)
    const ppsnRegex = /^\d{7}[A-Z]{1,2}$/;
    if (formData.ppsn && !ppsnRegex.test(formData.ppsn.replace(/\s/g, ''))) {
      errors.push('Invalid PPSN format');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    setError('');
    setValidationErrors([]);
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    if (!user) {
      setError('You must be logged in to submit the application');
      return;
    }
    
    setLoading(true);
    try {
      // Create comprehensive professional profile in Firebase
      await createProfessionalProfile(user, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.street,
          city: formData.city,
          county: formData.county,
          eircode: formData.eircode
        },
        citizenship: formData.citizenship,
        visaType: formData.visaType || undefined,
        services: formData.services,
        ppsn: formData.ppsn,
        experience: formData.experience,
        
        // Additional comprehensive questionnaire data
        qualifications: formData.qualifications,
        certifications: formData.certifications,
        previousEmployment: formData.previousEmployment,
        references: formData.references,
        aboutMe: formData.aboutMe,
        workingHours: formData.workingHours,
        availability: formData.availability,
        transportMode: formData.transportMode,
        coverageAreas: formData.coverageAreas,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        additionalInfo: formData.additionalInfo,
        
        status: 'pending', // Requires admin approval
        awaitingAdminApproval: true,
        createdAt: serverTimestamp()
      });
      
      // Send verification email to professional (Firebase built-in)
      await sendProfessionalEmailVerification(user);
      
      // Send admin notification email to genietest12345@gmail.com
      await sendAdminNotificationEmail({
        ...formData,
        uid: user.uid,
        applicationDate: new Date().toLocaleDateString()
      });
      
      // Send confirmation email to professional
      await sendApplicationConfirmationEmail(formData.email, formData.firstName);
      
      setSubmitted(true);
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in joining Genie as a professional service provider. 
              We'll review your application and get back to you within 48 hours.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>✓ Application sent for review</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><User className="h-5 w-5" /> Personal Information & Address</>}
              {currentStep === 2 && <><Globe className="h-5 w-5" /> Work Authorization</>}
              {currentStep === 3 && <><Briefcase className="h-5 w-5" /> Professional Details</>}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information & Address */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="+353 XX XXX XXXX"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => updateFormData('street', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          placeholder="Dublin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Input
                          id="county"
                          value={formData.county}
                          onChange={(e) => updateFormData('county', e.target.value)}
                          placeholder="Dublin"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="eircode">Eircode</Label>
                      <Input
                        id="eircode"
                        value={formData.eircode}
                        onChange={(e) => updateFormData('eircode', e.target.value)}
                        placeholder="D01 A1B2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Work Authorization */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="citizenship">Citizenship Status</Label>
                  <select
                    id="citizenship"
                    value={formData.citizenship}
                    onChange={(e) => updateFormData('citizenship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your citizenship status</option>
                    {CITIZENSHIP_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {formData.citizenship === 'Non-EU (Work Visa Required)' && (
                  <div>
                    <Label htmlFor="visaType">Visa/Stamp Type</Label>
                    <Input
                      id="visaType"
                      value={formData.visaType}
                      onChange={(e) => updateFormData('visaType', e.target.value)}
                      placeholder="e.g., Stamp 1G, Stamp 1, Stamp 2, etc."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please specify your current visa/stamp type (e.g., Stamp 1G for graduates, Stamp 1 for work permits, Stamp 2 for dependents, etc.)
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="ppsn">PPSN Number</Label>
                  <Input
                    id="ppsn"
                    value={formData.ppsn}
                    onChange={(e) => updateFormData('ppsn', e.target.value)}
                    placeholder="1234567A"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your Personal Public Service Number (required for tax purposes)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Professional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Services You Offer</Label>
                  <p className="text-sm text-gray-500 mb-3">Select all services you can provide:</p>
                  
                  <div className="space-y-4">
                    {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                        <div className="space-y-2">
                          {services.map(service => (
                            <label key={service} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => toggleService(service)}
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
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Selected services:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map(service => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || formData.services.length === 0}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Submit Application
                    </>
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
