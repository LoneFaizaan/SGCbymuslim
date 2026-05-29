/**
 * Creates a brand new Google Sheet specifically for storing SGC Business Leads.
 * Initial columns: Inquiry ID, Date, Division, Customer Name, Email, Phone, Message
 */
export async function createLeadsSpreadsheet(accessToken) {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      properties: {
        title: 'SGC Business Leads & Customer Inquiries',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Sheets creation failed: ${errText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write the table headers immediately to Sheet1
  await setupSpreadsheetHeaders(accessToken, spreadsheetId);

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Initializes the first row of columns in Sheet1 of the generated spreadsheet.
 */
export async function setupSpreadsheetHeaders(accessToken, spreadsheetId) {
  const headers = [
    [
      'Inquiry ID',
      'Submission Date & Time (IST)',
      'Business Division / Domain',
      'Client Full Name',
      'Email Address',
      'Phone Number / Contact',
      'Client Message / Requirement Details'
    ]
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:G1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: headers,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to initialize headers in spreadsheet: ${errText}`);
  }
}

/**
 * Appends a list of inquiries as rows into the designated Spreadsheet.
 */
export async function appendInquiriesToSpreadsheet(
  accessToken,
  spreadsheetId,
  inquiries
) {
  // Translate Inquiry instances into table arrays
  const rows = inquiries.map((inq) => [
    inq.id,
    inq.date,
    inq.businessSection.toUpperCase(),
    inq.name,
    inq.email,
    inq.phone,
    inq.message,
  ]);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:G:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to append rows to Google Sheets: ${errText}`);
  }
}

/**
 * Verifies if a given Spreadsheet is accessible using the provided accessToken
 */
export async function verifySpreadsheetAccess(accessToken, spreadsheetId) {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (e) {
    console.error('Error verifying spreadsheet ID existence:', e);
    return false;
  }
}
