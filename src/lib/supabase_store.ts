import { supabase } from './supabase';
import type { EventSettings, SlotConfig, PartnershipTier, ExperienceItem, MediaPartnerConfig, TenantSubmission, PartnerData } from './store';

// Helper to convert camelCase to snake_case for Supabase
const toSnakeCase = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
};

// Helper to convert snake_case to camelCase for Frontend
const toCamelCase = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
};

// Settings
export const fetchSettings = async (): Promise<EventSettings | null> => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  return toCamelCase(data) as EventSettings;
};

export const updateSettings = async (settings: EventSettings) => {
  const snakeSettings = toSnakeCase(settings);
  delete snakeSettings.updated_at; // Don't manually update this
  const { error } = await supabase.from('settings').upsert({ id: 1, ...snakeSettings });
  if (error) console.error('Error updating settings:', error);
  return !error;
};

// Slots
export const fetchSlots = async (): Promise<SlotConfig[]> => {
  const { data, error } = await supabase.from('slots').select('*');
  if (error) return [];
  return data.map(toCamelCase) as SlotConfig[];
};

export const upsertSlots = async (slots: SlotConfig[]) => {
  const snakeSlots = slots.map(toSnakeCase);
  const { error } = await supabase.from('slots').upsert(snakeSlots);
  if (error) console.error('Error upserting slots:', error);
};

// Tiers
export const fetchTiers = async (): Promise<PartnershipTier[]> => {
  const { data, error } = await supabase.from('partnership_tiers').select('*');
  if (error) return [];
  return data.map(toCamelCase) as PartnershipTier[];
};

export const upsertTiers = async (tiers: PartnershipTier[]) => {
  const snakeTiers = tiers.map(toSnakeCase);
  const { error } = await supabase.from('partnership_tiers').upsert(snakeTiers);
  if (error) console.error('Error upserting tiers:', error);
};

// Experiences
export const fetchExperiences = async (): Promise<ExperienceItem[]> => {
  const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: true });
  if (error) return [];
  return data.map(toCamelCase) as ExperienceItem[];
};

export const upsertExperiences = async (exps: ExperienceItem[]) => {
  const snakeExps = exps.map(exp => {
    const s = toSnakeCase(exp);
    delete s.created_at;
    return s;
  });
  const { error } = await supabase.from('experiences').upsert(snakeExps);
  if (error) console.error('Error upserting experiences:', error);
};

// Tenants
export const fetchTenants = async (): Promise<TenantSubmission[]> => {
  const { data, error } = await supabase.from('tenants').select('*').order('submitted_at', { ascending: false });
  if (error) return [];
  // Manual fix for block/block_id
  return data.map(d => {
    const c = toCamelCase(d);
    (c as any).block = d.block_id;
    return c;
  }) as TenantSubmission[];
};

export const insertTenant = async (tenant: Omit<TenantSubmission, 'id' | 'submittedAt' | 'status'>) => {
  const snakeTenant = toSnakeCase(tenant);
  (snakeTenant as any).block_id = tenant.block;
  delete (snakeTenant as any).block;
  
  const { data, error } = await supabase.from('tenants').insert(snakeTenant).select().single();
  if (error) console.error('Error inserting tenant:', error);
  return data ? toCamelCase(data) : null;
};

// Partners
export const fetchPartners = async (): Promise<PartnerData[]> => {
  const { data, error } = await supabase.from('partners').select('*').order('added_at', { ascending: false });
  if (error) return [];
  return data.map(toCamelCase) as PartnerData[];
};

export const upsertPartner = async (partner: PartnerData) => {
  const snakePartner = toSnakeCase(partner);
  const { error } = await supabase.from('partners').upsert(snakePartner);
  if (error) console.error('Error upserting partner:', error);
};

// Seeding / Migration tool
export const seedSupabaseFromLocal = async () => {
  const { getSettings, getSlots, getTiers, getExperiences, getTenants, getPartners } = await import('./store');
  
  console.log('Starting migration to Supabase...');
  
  await updateSettings(getSettings());
  await upsertSlots(getSlots());
  await upsertTiers(getTiers());
  await upsertExperiences(getExperiences());
  
  const tenants = getTenants();
  for (const t of tenants) {
     const s = toSnakeCase(t);
     (s as any).block_id = t.block;
     delete s.block;
     await supabase.from('tenants').upsert(s);
  }
  
  const partners = getPartners();
  for (const p of partners) {
    await supabase.from('partners').upsert(toSnakeCase(p));
  }
  
  console.log('Migration complete!');
};
