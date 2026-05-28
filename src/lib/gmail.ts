import { Inquiry } from '../types';

/**
 * Sends an email notification to the administrator via Gmail API using the logged-in user's OAuth access token.
 * Uses MIME layout format and base64url safe encoding.
 */
export async function sendInquiryEmail(
  accessToken: string,
  adminEmail: string,
  inquiry: Inquiry
): Promise<void> {
  const subject = `[SGC New Appointment/Lead] from ${inquiry.name} (${inquiry.businessSection.toUpperCase()})`;
  
  const getSectionLabel = (sect: Inquiry['businessSection']) => {
    switch (sect) {
      case 'gold': return 'SGC Gold Quote Inquiry';
      case 'catering': return 'Salafiya Catering Estimated Booking';
      case 'real_estate': return 'Salafi Realestate Lead';
      default: return 'General Corporate Inquiry';
    }
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fdfdfd;">
      <div style="background-color: #bfa15f; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-family: 'Georgia', serif; font-size: 20px;">Salafiya Group of Companies</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">New Business Appt / Inquiry Lead</p>
      </div>
      
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <h3 style="color: #bfa15f; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; margin-top: 0;">Lead Details</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 35%; color: #666666;">Customer Name:</td>
            <td style="padding: 8px 0; color: #111111; font-weight: 500;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666666;">Contact Email:</td>
            <td style="padding: 8px 0; color: #111111;">
              <a href="mailto:${inquiry.email}" style="color: #bfa15f; text-decoration: none;">${inquiry.email || 'N/A'}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666666;">Phone Number:</td>
            <td style="padding: 8px 0; color: #111111;">
              <a href="tel:${inquiry.phone}" style="color: #bfa15f; text-decoration: none;">${inquiry.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666666;">Submission Date:</td>
            <td style="padding: 8px 0; color: #111111; font-family: monospace; font-size: 12px;">${inquiry.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666666;">Business Division:</td>
            <td style="padding: 8px 0;">
              <span style="background-color: #f7f3eb; color: #bfa15f; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 1px solid #eee2cf;">
                ${getSectionLabel(inquiry.businessSection)}
              </span>
            </td>
          </tr>
        </table>
        
        <h3 style="color: #bfa15f; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; margin-top: 25px;">Requirement / Message Details</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #bfa15f; font-style: italic; white-space: pre-wrap; font-size: 13px; color: #444444; margin-top: 10px;">
          ${inquiry.message}
        </div>
      </div>
      
      <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e5e5e5; margin-top: 25px; color: #999999; font-size: 10.5px;">
        Sent automatically via Salafiya Group client portal.
      </div>
    </div>
  `;

  // To send Unicode text fields safely, encode parts in UTF-8 base64
  const utf8B64Subject = `=?utf-8?B?${btoa(
    unescape(encodeURIComponent(subject))
  )}?=`;

  const mimeParts = [
    `From: me`,
    `To: ${adminEmail}`,
    `Subject: ${utf8B64Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(htmlContent)))
  ];

  const rawMime = mimeParts.join('\r\n');

  // Convert to url-safe base64 string
  const base64UrlSafe = btoa(unescape(encodeURIComponent(rawMime)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64UrlSafe,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API failure: ${errorText}`);
  }
}
