const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Submit professional application
router.post('/submit-application', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'address', 'city', 'county', 'eircode', 'citizenshipStatus',
      'ppsnNumber', 'services', 'experience'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({ 
          error: `Missing required field: ${field}` 
        });
      }
    }

    // Additional validation for non-EU citizens
    if (formData.citizenshipStatus === 'non-eu') {
      if (!formData.visaType || !formData.visaExpiryDate) {
        return res.status(400).json({ 
          error: 'Visa type and expiry date are required for non-EU citizens' 
        });
      }
    }

    // Validate services array
    if (!Array.isArray(formData.services) || formData.services.length === 0) {
      return res.status(400).json({ 
        error: 'At least one service must be selected' 
      });
    }

    // Create email content
    const emailContent = generateApplicationEmail(formData);
    
    // Send email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ankit512.kumar@gmail.com',
      subject: `New Professional Application - ${formData.firstName} ${formData.lastName}`,
      html: emailContent,
      attachments: []
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to applicant
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Application Received - Genie Professional Network',
      html: generateConfirmationEmail(formData)
    };

    await transporter.sendMail(confirmationEmail);

    res.status(200).json({ 
      message: 'Application submitted successfully',
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Error submitting professional application:', error);
    res.status(500).json({ 
      error: 'Failed to submit application. Please try again.' 
    });
  }
});

// Generate application email HTML
function generateApplicationEmail(data) {
  const citizenshipStatusLabels = {
    'irish': 'Irish Citizen',
    'eu': 'EU/EEA Citizen',
    'non-eu': 'Non-EU Citizen'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        .services-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
        .service-tag { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .urgent { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Professional Application</h1>
        <p>Genie Service Platform</p>
      </div>
      
      <div class="content">
        <div class="urgent">
          <strong>⚠️ Action Required:</strong> Please review this professional application and respond within 2-3 business days.
        </div>

        <div class="section">
          <h3>📋 Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">${data.firstName} ${data.lastName}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${data.email}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${data.phone}</span>
            </div>
            <div class="info-item">
              <span class="label">Date of Birth:</span>
              <span class="value">${new Date(data.dateOfBirth).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🏠 Address Details</h3>
          <div class="info-item">
            <span class="label">Full Address:</span>
            <span class="value">${data.address}, ${data.city}, ${data.county}, ${data.eircode}</span>
          </div>
        </div>

        <div class="section">
          <h3>🛂 Work Authorization</h3>
          <div class="info-item">
            <span class="label">Citizenship Status:</span>
            <span class="value">${citizenshipStatusLabels[data.citizenshipStatus] || data.citizenshipStatus}</span>
          </div>
          ${data.visaType ? `
            <div class="info-item">
              <span class="label">Visa Type:</span>
              <span class="value">${data.visaType}</span>
            </div>
            <div class="info-item">
              <span class="label">Visa Expiry:</span>
              <span class="value">${new Date(data.visaExpiryDate).toLocaleDateString()}</span>
            </div>
          ` : ''}
          <div class="info-item">
            <span class="label">PPSN Number:</span>
            <span class="value">${data.ppsnNumber}</span>
          </div>
        </div>

        <div class="section">
          <h3>💼 Professional Details</h3>
          <div class="info-item">
            <span class="label">Services Offered:</span>
            <div class="services-list">
              ${data.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
            </div>
          </div>
          <div class="info-item">
            <span class="label">Experience:</span>
            <span class="value">${data.experience}</span>
          </div>
          ${data.qualifications ? `
            <div class="info-item">
              <span class="label">Qualifications:</span>
              <span class="value">${data.qualifications}</span>
            </div>
          ` : ''}
        </div>

        ${data.aboutMe ? `
          <div class="section">
            <h3>👤 About</h3>
            <div class="info-item">
              <span class="value">${data.aboutMe}</span>
            </div>
          </div>
        ` : ''}

        ${data.availability ? `
          <div class="section">
            <h3>📅 Availability</h3>
            <div class="info-item">
              <span class="value">${data.availability}</span>
            </div>
          </div>
        ` : ''}

        <div class="section">
          <h3>⏰ Application Details</h3>
          <div class="info-item">
            <span class="label">Submitted:</span>
            <span class="value">${new Date().toLocaleString()}</span>
          </div>
          <div class="info-item">
            <span class="label">Application ID:</span>
            <span class="value">APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate confirmation email for applicant
function generateConfirmationEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success-box { background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        .next-steps { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Application Received!</h1>
        <p>Thank you for joining Genie</p>
      </div>
      
      <div class="content">
        <p>Dear ${data.firstName},</p>
        
        <div class="success-box">
          <strong>✅ Your professional application has been successfully submitted!</strong>
        </div>

        <p>We've received your application to join our professional network and are excited about the possibility of working with you.</p>

        <div class="next-steps">
          <h3>What happens next?</h3>
          <ul>
            <li><strong>Review Process:</strong> Our team will review your application within 2-3 business days</li>
            <li><strong>Background Check:</strong> We may conduct verification of your details and qualifications</li>
            <li><strong>Approval:</strong> If approved, you'll receive access to your professional dashboard</li>
            <li><strong>Training:</strong> We'll provide onboarding materials to help you get started</li>
          </ul>
        </div>

        <p><strong>Services you applied for:</strong></p>
        <ul>
          ${data.services.map(service => `<li>${service}</li>`).join('')}
        </ul>

        <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>

        <p>Best regards,<br>
        The Genie Team</p>
      </div>
    </body>
    </html>
  `;
}

// Send admin notification email for professional application approval
router.post('/admin-notification', async (req, res) => {
  try {
    const applicationData = req.body;
    const adminEmail = 'genietest12345@gmail.com';
    
    const transporter = createTransporter();
    
    const adminEmailHtml = generateAdminNotificationEmail(applicationData);
    
    // Send admin notification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Professional Application - ${applicationData.firstName} ${applicationData.lastName}`,
      html: adminEmailHtml
    });
    
    console.log(`Admin notification sent for professional: ${applicationData.email}`);
    res.json({ success: true, message: 'Admin notification sent successfully' });
  } catch (error) {
    console.error('Admin notification error:', error);
    res.status(500).json({ error: 'Failed to send admin notification' });
  }
});

// Send confirmation email to professional after application submission
router.post('/confirmation-email', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    
    const transporter = createTransporter();
    
    const confirmationEmailHtml = generateConfirmationEmail({ firstName, email });
    
    // Send confirmation email to professional
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Application Received - Genie Professional Portal',
      html: confirmationEmailHtml
    });
    
    console.log(`Confirmation email sent to: ${email}`);
    res.json({ success: true, message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Confirmation email error:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Generate admin notification email with comprehensive application details
function generateAdminNotificationEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .info-item { background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .services-list, .qualifications-list, .hours-list, .areas-list { 
          display: flex; flex-wrap: wrap; gap: 5px; 
        }
        .tag { background-color: #e5e7eb; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
        .actions { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .btn-approve { background-color: #10b981; color: white; }
        .btn-reject { background-color: #ef4444; color: white; }
        .btn-review { background-color: #6366f1; color: white; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 New Professional Application</h1>
        <p>Genie Professional Portal - Admin Review Required</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h3>👤 Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Full Name:</div>
              <div class="value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="info-item">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="info-item">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            <div class="info-item">
              <div class="label">Date of Birth:</div>
              <div class="value">${data.dateOfBirth}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label">Address:</div>
            <div class="value">${data.street}, ${data.city}, ${data.county} ${data.eircode}</div>
          </div>
        </div>
        
        <div class="section">
          <h3>🌍 Citizenship & Work Authorization</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Citizenship Status:</div>
              <div class="value">${data.citizenship}</div>
            </div>
            ${data.visaType ? `
            <div class="info-item">
              <div class="label">Visa Type:</div>
              <div class="value">${data.visaType}</div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="section">
          <h3>💼 Professional Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">PPSN:</div>
              <div class="value">${data.ppsn}</div>
            </div>
            <div class="info-item">
              <div class="label">Experience Level:</div>
              <div class="value">${data.experience}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label">Services Offered:</div>
            <div class="services-list">
              ${data.services.map(service => `<span class="tag">${service}</span>`).join('')}
            </div>
          </div>
          
          ${data.qualifications && data.qualifications.length > 0 ? `
          <div class="info-item">
            <div class="label">Qualifications:</div>
            <div class="qualifications-list">
              ${data.qualifications.map(qual => `<span class="tag">${qual}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.certifications ? `
          <div class="info-item">
            <div class="label">Certifications:</div>
            <div class="value">${data.certifications}</div>
          </div>
          ` : ''}
          
          ${data.previousEmployment ? `
          <div class="info-item">
            <div class="label">Previous Employment:</div>
            <div class="value">${data.previousEmployment}</div>
          </div>
          ` : ''}
          
          ${data.references ? `
          <div class="info-item">
            <div class="label">References:</div>
            <div class="value">${data.references}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <h3>📅 Availability & Coverage</h3>
          ${data.workingHours && data.workingHours.length > 0 ? `
          <div class="info-item">
            <div class="label">Working Hours:</div>
            <div class="hours-list">
              ${data.workingHours.map(hour => `<span class="tag">${hour}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          <div class="info-grid">
            ${data.availability ? `
            <div class="info-item">
              <div class="label">Availability:</div>
              <div class="value">${data.availability}</div>
            </div>
            ` : ''}
            ${data.transportMode ? `
            <div class="info-item">
              <div class="label">Transport Mode:</div>
              <div class="value">${data.transportMode}</div>
            </div>
            ` : ''}
          </div>
          
          ${data.coverageAreas && data.coverageAreas.length > 0 ? `
          <div class="info-item">
            <div class="label">Coverage Areas:</div>
            <div class="areas-list">
              ${data.coverageAreas.map(area => `<span class="tag">${area}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          ${data.emergencyContact ? `
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Emergency Contact:</div>
              <div class="value">${data.emergencyContact}</div>
            </div>
            <div class="info-item">
              <div class="label">Emergency Phone:</div>
              <div class="value">${data.emergencyPhone}</div>
            </div>
          </div>
          ` : ''}
        </div>
        
        ${data.aboutMe ? `
        <div class="section">
          <h3>📝 About Me</h3>
          <div class="info-item">
            <div class="value">${data.aboutMe}</div>
          </div>
        </div>
        ` : ''}
        
        ${data.additionalInfo ? `
        <div class="section">
          <h3>ℹ️ Additional Information</h3>
          <div class="info-item">
            <div class="value">${data.additionalInfo}</div>
          </div>
        </div>
        ` : ''}
        
        <div class="actions">
          <h3>🎯 Admin Actions Required</h3>
          <p>Please review this professional application and take appropriate action:</p>
          <a href="http://localhost:5173/admin/professional-approval" class="btn btn-review">📋 Review in Dashboard</a>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            <strong>Application ID:</strong> ${data.uid}<br>
            <strong>Submitted:</strong> ${data.applicationDate || new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
