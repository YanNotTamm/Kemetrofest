import { supabase } from './supabase';

// Helper to convert camelCase to snake_case for Supabase
const toSnakeCase = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
};

// ========================================
// localStorage-based data store for KeMetroFest
// ========================================

export interface EventSettings {
  eventName: string;
  eventTagline: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  logoImage: string;
  heroImage: string;
  aboutImage: string;
  experienceImage: string;
  formImage: string;
  slotImage: string;
  whatsappNumber: string;
  email: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutDescription: string;
  metaTitle: string;
  metaDescription: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  showInstagram: boolean;
  showYoutube: boolean;
  showFacebook: boolean;
  registrationDeadline: string;
  organizerName: string;
  waTemplatePartner: string;
  waTemplateMedia: string;
  waTemplateTenant: string;
}

export interface SlotConfig {
  id: string;
  name: string;
  totalSlots: number;
  position: string;
  image?: string;
  available: boolean;
}

export interface PartnershipTier {
  id: string;
  name: string;
  icon: string; // 'crown' | 'gem' | 'award'
  color: string;
  benefits: string;
  price: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  series: string;
  description: string;
  image: string;
}

export interface MediaPartnerConfig {
  id: string;
  name: string;
  logo: string;
}

export interface TenantSubmission {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  block: string;
  assignedSlot?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PartnerData {
  id: string;
  name: string;
  type: 'media' | 'sponsor';
  tier?: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  addedAt: string;
  logo?: string;
}

// ========================================
// Default values
// ========================================

const DEFAULT_SETTINGS: EventSettings = {
  eventName: 'KeMetroFest',
  eventTagline: 'Festival Kuliner Kota Metro — 55+ stan, musik, dan komunitas.',
  startDate: '2025-05-15',
  endDate: '2025-05-18',
  startTime: '16:00',
  endTime: '23:00',
  locationName: 'Metro Garden',
  locationAddress: 'Jl. KH. Wahid Hasyim, Kota Metro, Lampung',
  logoImage: '',
  heroImage: '/images/hero_festival.jpg',
  aboutImage: '/images/about_cooking.jpg',
  experienceImage: '/images/experience_night.jpg',
  formImage: '/images/form_crowd.jpg',
  slotImage: '/images/slot_stall.jpg',
  whatsappNumber: '6281234567890',
  email: 'kemitraan@kemetrofest.id',
  bankName: 'Bank BCA',
  bankAccount: '1234567890',
  bankHolder: 'KeMetroFest Event',
  aboutBadge: 'GRATIS',
  aboutTitle: 'Tujuan Kegiatan',
  aboutDescription: 'Mendorong UMKM kuliner lokal tumbuh dan dikenal lebih luas.\n\nMenyatukan komunitas kreatif, musik, dan seni di satu ruang kota.\n\nMenciptakan pengalaman keluarga yang aman, ramah anak, dan berkesan.',
  metaTitle: 'KeMetroFest 2025 - Festival Kuliner & UMKM Kota Metro',
  metaDescription: 'Bergabunglah di KeMetroFest 2025! Festival kuliner, musik, dan UMKM terbesar di Kota Metro. Temukan pengalaman seru untuk keluarga.',
  instagramUrl: '#',
  youtubeUrl: '#',
  facebookUrl: '#',
  showInstagram: true,
  showYoutube: true,
  showFacebook: true,
  registrationDeadline: '2025-05-10',
  organizerName: 'Dinas KUMKM Kota Metro',
  waTemplatePartner: 'Halo Admin KeMetroFest, saya tertarik menjadi mitra dan ingin meminta proposal.',
  waTemplateMedia: 'Halo Admin KeMetroFest, kami tertarik untuk menjadi Media Partner.',
  waTemplateTenant: '\uD83C\uDFAA *PENDAFTARAN STAN KEMETROFEST*\n\n\uD83D\uDCCB *Data Pendaftar:*\n\u2022 Nama Usaha: {businessName}\n\u2022 PIC: {contactName}\n\u2022 WhatsApp: {phone}\n\u2022 Email: {email}\n\u2022 Kategori: {category}\n\u2022 Blok: {block}\n\nMohon konfirmasi pendaftaran saya. Terima kasih! \uD83D\uDE4F',
};

const DEFAULT_SLOTS: SlotConfig[] = [
  { id: '1', name: 'Blok A', totalSlots: 10, position: 'Dekat Panggung Utama', image: '', available: true },
  { id: '2', name: 'Blok B', totalSlots: 15, position: 'Tengah Lapangan', image: '', available: true },
];

const DEFAULT_PARTNERSHIP_TIERS: PartnershipTier[] = [
  { id: '1', name: 'Title Partner', icon: 'crown', color: 'bg-mint', benefits: 'Logo di semua materi utama + booth premium + sesi foto eksklusif + mention di semua media sosial', price: 'Rp 50.000.000' },
  { id: '2', name: 'Platinum', icon: 'gem', color: 'bg-sky', benefits: 'Logo besar di backdrop + booth standar + mention di panggung + distribusi flyer', price: 'Rp 25.000.000' },
  { id: '3', name: 'Gold', icon: 'award', color: 'bg-cream', benefits: 'Logo di backdrop + posting media sosial + banner di area festival', price: 'Rp 10.000.000' },
];

const DEFAULT_MEDIA_PARTNERS: MediaPartnerConfig[] = [
  { id: '1', name: 'Radio Metro FM', logo: '' },
  { id: '2', name: 'Lampung Post', logo: '' },
];

// ========================================
// Store helpers
// ========================================

const KEYS = {
  settings: 'kmf_settings',
  slots: 'kmf_slots',
  tiers: 'kmf_tiers',
  mediaPartners: 'kmf_media_partners',
  tenants: 'kmf_tenants',
  PARTNERS: 'kmf_partners',
  EXPERIENCES: 'kmf_experiences',
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage Save Error:', e);
    alert('Gagal menyimpan data! Kemungkinan memori browser penuh (kuota localStorage). Coba hapus beberapa gambar besar.');
  }
}

// ========================================
// Public API
// ========================================

// Settings
export function getSettings(): EventSettings {
  const stored = get(KEYS.settings, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}
export function saveSettings(s: EventSettings): void {
  set(KEYS.settings, s);
  // Background sync to Supabase
  const snake = toSnakeCase(s);
  delete snake.updated_at;
  supabase.from('settings').upsert({ id: 1, ...snake }).then();
}

// Slots
export function getSlots(): SlotConfig[] {
  return get(KEYS.slots, DEFAULT_SLOTS);
}
export function saveSlots(s: SlotConfig[]): void {
  set(KEYS.slots, s);
  supabase.from('slots').upsert(s.map(toSnakeCase)).then();
}

// Partnership Tiers
export function getTiers(): PartnershipTier[] {
  return get(KEYS.tiers, DEFAULT_PARTNERSHIP_TIERS);
}
export function saveTiers(t: PartnershipTier[]): void {
  set(KEYS.tiers, t);
  supabase.from('partnership_tiers').upsert(t.map(toSnakeCase)).then();
}

// Media Partners (Landing Page)
export function getMediaPartners(): MediaPartnerConfig[] {
  return get(KEYS.mediaPartners, DEFAULT_MEDIA_PARTNERS);
}
export function saveMediaPartners(m: MediaPartnerConfig[]): void {
  set(KEYS.mediaPartners, m);
}

// Tenant Submissions
export function getTenants(): TenantSubmission[] {
  return get(KEYS.tenants, []);
}
export function saveTenants(t: TenantSubmission[]): void {
  set(KEYS.tenants, t);
  const snakeTenants = t.map(tenant => {
    const s = toSnakeCase(tenant);
    (s as any).block_id = tenant.block;
    delete s.block;
    return s;
  });
  supabase.from('tenants').upsert(snakeTenants).then();
}
export function addTenant(t: Omit<TenantSubmission, 'id' | 'submittedAt' | 'status'>): TenantSubmission {
  const tenants = getTenants();
  const newTenant: TenantSubmission = {
    ...t,
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  tenants.push(newTenant);
  saveTenants(tenants);
  return newTenant;
}

// Partner Data
export function getPartners(): PartnerData[] {
  return get(KEYS.PARTNERS, []);
}
export function savePartners(p: PartnerData[]): void {
  set(KEYS.PARTNERS, p);
  supabase.from('partners').upsert(p.map(toSnakeCase)).then();
}
export const addPartner = (data: Omit<PartnerData, 'id' | 'status' | 'addedAt'>) => {
  const partners = getPartners();
  const newPartner: PartnerData = {
    ...data,
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString(),
    status: 'active'
  };
  savePartners([...partners, newPartner]);
  return newPartner;
};

// Experiences
export const getExperiences = (): ExperienceItem[] => {
  const data = localStorage.getItem(KEYS.EXPERIENCES);
  return data ? JSON.parse(data) : [
    { id: '1', title: 'Pasar Malam', series: 'Series 1', description: 'Kemeriahan pasar malam perdana dengan 30+ tenant pilihan.', image: '/images/exp1.jpg' },
    { id: '2', title: 'Festival Kuliner', series: 'Series 2', description: 'Menghadirkan ragam rasa nusantara dalam satu ruang.', image: '/images/exp2.jpg' },
  ];
};

export const saveExperiences = (data: ExperienceItem[]) => {
  localStorage.setItem(KEYS.EXPERIENCES, JSON.stringify(data));
  supabase.from('experiences').upsert(data.map(e => {
    const s = toSnakeCase(e);
    delete s.created_at;
    return s;
  })).then();
};
