import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lbqetridworfclomkoph.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Srd-jlUUD_U_Ta_UOhJF_Q_m7jpvnoh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to map DB snake_case structure to client camelCase
export function mapFromSupabase(row) {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    name: row.name,
    email: row.email,
    phone: row.phone,
    businessSection: row.business_section,
    message: row.message,
    status: row.status || 'new',
    adminNotes: row.admin_notes || '',
    syncedToSheets: row.synced_to_sheets,
    syncedToDatabase: row.synced_to_database,
    createdAt: row.created_at ? { seconds: Math.floor(new Date(row.created_at).getTime() / 1000) } : null
  };
}

// Helper to map client camelCase to DB snake_case
export function mapToSupabase(data) {
  if (!data) return null;
  const mapped = {};
  if (data.id !== undefined) mapped.id = data.id;
  if (data.date !== undefined) mapped.date = data.date;
  if (data.name !== undefined) mapped.name = data.name;
  if (data.email !== undefined) mapped.email = data.email;
  if (data.phone !== undefined) mapped.phone = data.phone;
  if (data.businessSection !== undefined) mapped.business_section = data.businessSection;
  if (data.message !== undefined) mapped.message = data.message;
  if (data.status !== undefined) mapped.status = data.status;
  if (data.adminNotes !== undefined) mapped.admin_notes = data.adminNotes;
  if (data.syncedToSheets !== undefined) mapped.synced_to_sheets = data.syncedToSheets;
  if (data.syncedToDatabase !== undefined) mapped.synced_to_database = data.syncedToDatabase;
  return mapped;
}

/**
 * Fetch all inquiries from Supabase
 */
export async function fetchSupabaseInquiries() {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase SDK] Fetch error:', error);
      return [];
    }
    return (data || []).map(mapFromSupabase);
  } catch (err) {
    console.error('[Supabase SDK] Catch fetch error:', err);
    return [];
  }
}

/**
 * Save a new inquiry to Supabase
 */
export async function saveInquiryToSupabase(inquiryData) {
  try {
    const dbPayload = mapToSupabase({
      ...inquiryData,
      status: inquiryData.status || 'new',
      adminNotes: inquiryData.adminNotes || '',
      syncedToDatabase: true
    });
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([dbPayload])
      .select();

    if (error) {
      console.error('[Supabase SDK] Insert error:', error);
      return null;
    }
    return data && data[0] ? mapFromSupabase(data[0]) : null;
  } catch (err) {
    console.error('[Supabase SDK] Catch insert error:', err);
    return null;
  }
}

/**
 * Update an inquiry's status, adminNotes or other fields
 */
export async function updateInquiryInSupabase(id, updatedFields) {
  try {
    const dbPayload = mapToSupabase(updatedFields);
    const { data, error } = await supabase
      .from('inquiries')
      .update(dbPayload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Supabase SDK] Update error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase SDK] Catch update error:', err);
    return false;
  }
}

/**
 * Delete an inquiry from Supabase
 */
export async function deleteInquiryFromSupabase(id) {
  try {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase SDK] Delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase SDK] Catch delete error:', err);
    return false;
  }
}
