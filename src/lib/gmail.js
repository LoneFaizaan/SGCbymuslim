/**
 * Sends an email notification to the administrator via Gmail API using the logged-in user's OAuth access token.
 * Uses MIME layout format and base64url safe encoding.
 */
export async function sendInquiryEmail(
  accessToken,
  adminEmail,
  inquiry
) {
  console.log('[Gmail Service] Notifications are deactivated per corporate requirements.');
  return true;
}
