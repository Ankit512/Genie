// Admin notification system for professional applications
// Sends detailed application info to genietest12345@gmail.com for approval

interface ProfessionalApplicationData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  street: string;
  city: string;
  county: string;
  eircode: string;
  
  // Citizenship & Work Authorization
  citizenship: string;
  visaType?: string;
  
  // Professional Details
  services: string[];
  ppsn: string;
  experience: string;
  qualifications: string[];
  certifications: string;
  previousEmployment: string;
  references: string;
  
  // About Me & Availability
  aboutMe: string;
  workingHours: string[];
  availability: string;
  transportMode: string;
  coverageAreas: string[];
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo: string;
  
  // System fields
  uid: string;
  applicationDate: string;
}

export const sendAdminNotificationEmail = async (
  applicationData: ProfessionalApplicationData
): Promise<void> => {
  try {
    const response = await fetch('/api/professional/admin-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...applicationData,
        adminEmail: 'genietest12345@gmail.com'
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send admin notification: ${response.statusText}`);
    }

    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw new Error('Failed to send admin notification email');
  }
};

export const sendApplicationConfirmationEmail = async (
  email: string,
  firstName: string
): Promise<void> => {
  try {
    const response = await fetch('/api/professional/confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send confirmation email: ${response.statusText}`);
    }

    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};
