import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { createJob } from '@/lib/firebase-jobs';
import { useAuth } from '@/hooks/useAuth';

interface JobFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  timeframe: string;
  urgency: 'low' | 'medium' | 'high';
  requirements: string[];
  images: string[];
}

const SERVICE_CATEGORIES = [
  'Cleaning & Pest Control',
  'Beauty & Wellness', 
  'IT Services',
  'Home Maintenance',
  'Tutoring & Education',
  'Pet Care',
  'Event Services',
  'Transportation'
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Flexible (1-2 weeks)', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Standard (3-7 days)', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Urgent (1-2 days)', color: 'bg-red-100 text-red-800' }
];

const TIMEFRAME_OPTIONS = [
  'Within 24 hours',
  'This weekend',
  'Next week',
  '2-3 weeks',
  'Flexible timing'
];

export function JobPostingForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    budgetMin: 0,
    budgetMax: 0,
    timeframe: '',
    urgency: 'medium',
    requirements: [],
    images: []
  });
  
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateFormData = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      updateFormData('requirements', [...formData.requirements, currentRequirement.trim()]);
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    updateFormData('requirements', formData.requirements.filter(r => r !== requirement));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Job title is required');
    if (!formData.description.trim()) errors.push('Job description is required');
    if (!formData.category) errors.push('Service category is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.timeframe) errors.push('Timeframe is required');
    
    if (formData.budgetMin <= 0) errors.push('Minimum budget must be greater than 0');
    if (formData.budgetMax <= 0) errors.push('Maximum budget must be greater than 0');
    if (formData.budgetMax < formData.budgetMin) errors.push('Maximum budget must be greater than minimum budget');
    
    if (formData.description.length < 50) errors.push('Job description must be at least 50 characters');
    if (formData.title.length < 10) errors.push('Job title must be at least 10 characters');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    if (!user) {
      setError('You must be logged in to post a job');
      return;
    }
    
    setLoading(true);
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        budget: {
          min: formData.budgetMin,
          max: formData.budgetMax,
          currency: 'EUR'
        },
        timeframe: formData.timeframe,
        customerId: user.uid,
        customerName: user.displayName || user.email?.split('@')[0] || 'Customer',
        customerRating: 4.5, // This would come from customer profile
        status: 'open',
        urgency: formData.urgency,
        requirements: formData.requirements,
        images: formData.images
      });
      
      setSuccess(true);
    } catch (error: any) {
      console.error('Job posting error:', error);
      setError(error.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Posted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your job has been posted and is now visible to professionals. You'll receive notifications when professionals submit bids.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>✓ Job is now live and visible to professionals</p>
              <p>✓ You'll be notified when professionals bid</p>
              <p>✓ Review bids and select the best professional</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-6 w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Briefcase className="h-6 w-6" />
              Post a New Job
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Describe your project and connect with qualified professionals
            </p>
          </CardHeader>
          
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="e.g., House cleaning service needed"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Service Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="e.g., Dublin 4, Ireland"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your project in detail. Include specific requirements, expectations, and any important details..."
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/50 characters minimum
                </p>
              </div>

              {/* Budget */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4" />
                  Budget Range (EUR) *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetMin" className="text-sm">Minimum</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      value={formData.budgetMin || ''}
                      onChange={(e) => updateFormData('budgetMin', parseInt(e.target.value) || 0)}
                      placeholder="50"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetMax" className="text-sm">Maximum</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      value={formData.budgetMax || ''}
                      onChange={(e) => updateFormData('budgetMax', parseInt(e.target.value) || 0)}
                      placeholder="200"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Timeframe and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="timeframe" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    When do you need this done? *
                  </Label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => updateFormData('timeframe', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeframe</option>
                    {TIMEFRAME_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Urgency Level</Label>
                  <div className="mt-2 space-y-2">
                    {URGENCY_OPTIONS.map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={formData.urgency === option.value}
                          onChange={(e) => updateFormData('urgency', e.target.value as 'low' | 'medium' | 'high')}
                          className="text-blue-600"
                        />
                        <Badge className={option.color}>
                          {option.label}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label>Specific Requirements (Optional)</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    placeholder="e.g., Must have own cleaning supplies"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button
                    type="button"
                    onClick={addRequirement}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                {formData.requirements.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.requirements.map((requirement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeRequirement(requirement)}
                      >
                        {requirement} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
