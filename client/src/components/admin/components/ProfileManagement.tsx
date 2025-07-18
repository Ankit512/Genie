import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Award, 
  Upload,
  Save,
  Edit
} from 'lucide-react';
import { Professional } from '../types';
import { MockDataService } from '../services/mockDataService';

export function ProfileManagement() {
  const [profile, setProfile] = useState<Professional | null>(null);
  const [editingProfile, setEditingProfile] = useState<Partial<Professional>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const profileData = await MockDataService.getProfessionalProfile();
        setProfile(profileData);
        setEditingProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const updatedProfile = await MockDataService.updateProfessionalProfile(editingProfile);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditingProfile(profile);
    }
    setEditMode(false);
  };

  const updateAvailability = (day: string, field: string, value: any) => {
    setEditingProfile(prev => {
      const currentAvailability = prev.availability || profile?.availability || {};
      const currentDayAvailability = currentAvailability[day] || { isAvailable: false, startTime: '', endTime: '' };
      
      return {
        ...prev,
        availability: {
          ...currentAvailability,
          [day]: {
            ...currentDayAvailability,
            [field]: value
          }
        }
      };
    });
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Management</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
          <p className="text-muted-foreground">Manage your professional profile and availability</p>
        </div>
        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                {editMode && (
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                {editMode ? (
                  <Input
                    value={editingProfile.name || ''}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                {editMode ? (
                  <Input
                    type="email"
                    value={editingProfile.email || ''}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                {editMode ? (
                  <Input
                    type="tel"
                    value={editingProfile.phone || ''}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Bio</label>
                {editMode ? (
                  <textarea
                    value={editingProfile.bio || ''}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 w-full min-h-[80px] px-3 py-2 border rounded-md"
                    placeholder="Tell customers about your experience and expertise..."
                  />
                ) : (
                  <p className="mt-1 text-foreground">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Services Offered</label>
              {editMode ? (
                <div className="mt-1 space-y-2">
                  {(editingProfile.services || []).map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={service}
                        onChange={(e) => {
                          const newServices = [...(editingProfile.services || [])];
                          newServices[index] = e.target.value;
                          setEditingProfile(prev => ({ ...prev, services: newServices }));
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newServices = (editingProfile.services || []).filter((_, i) => i !== index);
                          setEditingProfile(prev => ({ ...prev, services: newServices }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newServices = [...(editingProfile.services || []), ''];
                      setEditingProfile(prev => ({ ...prev, services: newServices }));
                    }}
                  >
                    Add Service
                  </Button>
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <Badge key={index} variant="secondary">{service}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Service Areas</label>
              {editMode ? (
                <div className="mt-1 space-y-2">
                  {(editingProfile.serviceAreas || []).map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={area}
                        onChange={(e) => {
                          const newAreas = [...(editingProfile.serviceAreas || [])];
                          newAreas[index] = e.target.value;
                          setEditingProfile(prev => ({ ...prev, serviceAreas: newAreas }));
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAreas = (editingProfile.serviceAreas || []).filter((_, i) => i !== index);
                          setEditingProfile(prev => ({ ...prev, serviceAreas: newAreas }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAreas = [...(editingProfile.serviceAreas || []), ''];
                      setEditingProfile(prev => ({ ...prev, serviceAreas: newAreas }));
                    }}
                  >
                    Add Area
                  </Button>
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.serviceAreas.map((area, index) => (
                    <Badge key={index} variant="outline">{area}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Certifications</label>
              {editMode ? (
                <div className="mt-1 space-y-2">
                  {(editingProfile.certifications || []).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...(editingProfile.certifications || [])];
                          newCerts[index] = e.target.value;
                          setEditingProfile(prev => ({ ...prev, certifications: newCerts }));
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCerts = (editingProfile.certifications || []).filter((_, i) => i !== index);
                          setEditingProfile(prev => ({ ...prev, certifications: newCerts }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newCerts = [...(editingProfile.certifications || []), ''];
                      setEditingProfile(prev => ({ ...prev, certifications: newCerts }));
                    }}
                  >
                    Add Certification
                  </Button>
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{profile.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.completedJobs}</div>
                  <div className="text-sm text-muted-foreground">Jobs Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {new Date(profile.joinedDate).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">Joined</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Availability Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const dayAvailability = editingProfile.availability?.[day.key] || profile.availability[day.key];
              return (
                <div key={day.key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-24 font-medium">{day.label}</div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dayAvailability?.isAvailable || false}
                      onChange={(e) => updateAvailability(day.key, 'isAvailable', e.target.checked)}
                      disabled={!editMode}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Available</span>
                  </div>

                  {dayAvailability?.isAvailable && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">From:</span>
                      <input
                        type="time"
                        value={dayAvailability.startTime}
                        onChange={(e) => updateAvailability(day.key, 'startTime', e.target.value)}
                        disabled={!editMode}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <span className="text-sm text-muted-foreground">To:</span>
                      <input
                        type="time"
                        value={dayAvailability.endTime}
                        onChange={(e) => updateAvailability(day.key, 'endTime', e.target.value)}
                        disabled={!editMode}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 