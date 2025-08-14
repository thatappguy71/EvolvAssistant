import { MailService } from '@sendgrid/mail';

console.log('Initializing email service...');
console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);
console.log('Email service initialized successfully');

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Beta signup notification templates
export async function sendBetaSignupNotification(signupData: {
  name: string;
  email: string;
  motivation: string;
  experience?: string;
  referralSource?: string;
}): Promise<boolean> {
  // Use the user's email that they provided when setting up SendGrid account as both admin and from email
  // This ensures the email is verified in SendGrid
  const adminEmail = process.env.ADMIN_EMAIL || process.env.VERIFIED_EMAIL || 'admin@evolv.app';
  const fromEmail = process.env.FROM_EMAIL || process.env.VERIFIED_EMAIL || 'noreply@evolv.app';
  
  console.log('Sending email from:', fromEmail, 'to:', adminEmail);
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New Beta Application</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Someone wants to join the Evolv beta!</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Applicant Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Name:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${signupData.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Email:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${signupData.email}</span>
          </div>
          
          ${signupData.experience ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Experience Level:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${signupData.experience}</span>
          </div>
          ` : ''}
          
          ${signupData.referralSource ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">How they found us:</strong>
            <span style="color: #6b7280; margin-left: 10px;">${signupData.referralSource}</span>
          </div>
          ` : ''}
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">Motivation</h3>
          <p style="color: #6b7280; line-height: 1.6; margin: 0;">${signupData.motivation}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/beta-admin` : '#'}" 
             style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            Review Application
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            This notification was sent automatically when a new beta application was submitted.
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
New Beta Application for Evolv

Applicant Details:
- Name: ${signupData.name}
- Email: ${signupData.email}
${signupData.experience ? `- Experience: ${signupData.experience}` : ''}
${signupData.referralSource ? `- Referral Source: ${signupData.referralSource}` : ''}

Motivation:
${signupData.motivation}

Review the application in the admin panel: ${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/beta-admin` : 'Admin Panel'}
  `;

  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `🚀 New Beta Application: ${signupData.name}`,
    text: textContent,
    html: htmlContent
  });
}

// Welcome email for beta testers
export async function sendBetaWelcomeEmail(applicantData: {
  name: string;
  email: string;
}): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || process.env.VERIFIED_EMAIL || 'noreply@evolv.app';
  
  console.log('Sending welcome email from:', fromEmail, 'to:', applicantData.email);
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Evolv Beta! 🎉</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 16px;">Your application has been approved</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${applicantData.name}! 👋</h2>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! You've been accepted into the Evolv beta testing program. We're excited to have you help shape the future of wellness and habit tracking.
          </p>
          
          <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">🎁 Your Beta Benefits:</h3>
          <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
            <li><strong>Lifetime Premium Access</strong> - Keep premium features forever</li>
            <li><strong>Early AI Features</strong> - First access to new AI recommendations</li>
            <li><strong>Exclusive Community</strong> - Join our private beta tester group</li>
            <li><strong>Direct Impact</strong> - Your feedback shapes product development</li>
          </ul>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">🚀 Next Steps:</h3>
          <ol style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
            <li>Log in to your Evolv account and explore the platform</li>
            <li>Try the AI-powered recommendations feature</li>
            <li>Test habit tracking and wellness metrics</li>
            <li>Share your feedback through the in-app feedback system</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : '#'}" 
             style="background: #10b981; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
            Start Your Beta Journey
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
            Questions? Reply to this email - we'd love to hear from you!<br>
            The Evolv Team
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
Welcome to Evolv Beta!

Hi ${applicantData.name},

Congratulations! You've been accepted into the Evolv beta testing program. We're excited to have you help shape the future of wellness and habit tracking.

Your Beta Benefits:
• Lifetime Premium Access - Keep premium features forever
• Early AI Features - First access to new AI recommendations  
• Exclusive Community - Join our private beta tester group
• Direct Impact - Your feedback shapes product development

Next Steps:
1. Log in to your Evolv account and explore the platform
2. Try the AI-powered recommendations feature
3. Test habit tracking and wellness metrics
4. Share your feedback through the in-app feedback system

Get started: ${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'Evolv Platform'}

Questions? Reply to this email - we'd love to hear from you!
The Evolv Team
  `;

  return await sendEmail({
    to: applicantData.email,
    from: fromEmail,
    subject: '🎉 Welcome to Evolv Beta - You\'re In!',
    text: textContent,
    html: htmlContent
  });
}