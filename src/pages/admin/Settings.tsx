import { useState } from 'react';
import { getSettings, saveSettings, getSlots, saveSlots, getTiers, saveTiers, getMediaPartners, saveMediaPartners, getExperiences, saveExperiences } from '@/lib/store';
import type { EventSettings, SlotConfig, PartnershipTier, MediaPartnerConfig, ExperienceItem } from '@/lib/store';
import { updateSettings as syncSettings, upsertSlots, upsertTiers, upsertExperiences, seedSupabaseFromLocal } from '@/lib/supabase_store';
import { Save, Plus, Trash2, Database, Download, Upload, FileCode, Camera, Cloud } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState<EventSettings>(getSettings());
  const [slots, setSlots] = useState<SlotConfig[]>(getSlots());
  const [tiers, setTiers] = useState<PartnershipTier[]>(getTiers());
  const [mediaPartners, setMediaPartners] = useState<MediaPartnerConfig[]>(getMediaPartners());
  const [experiences, setExperiences] = useState<ExperienceItem[]>(getExperiences());
  const [activeTab, setActiveTab] = useState<'general' | 'slots' | 'experience' | 'partnership' | 'media' | 'templates' | 'backup'>('general');

  const handleSaveSettings = async () => {
    saveSettings(settings);
    await syncSettings(settings);
    toast.success('Pengaturan berhasil disimpan ke Cloud!');
  };

  const handleSaveSlots = async () => {
    saveSlots(slots);
    await upsertSlots(slots);
    toast.success('Data slot berhasil disimpan ke Cloud!');
  };

  const handleSaveTiers = async () => {
    saveTiers(tiers);
    await upsertTiers(tiers);
    toast.success('Data kemitraan berhasil disimpan ke Cloud!');
  };

  const handleSaveMediaPartners = () => {
    saveMediaPartners(mediaPartners);
    toast.success('Data Media Partner berhasil disimpan!');
  };

  const handleSaveExperiences = async () => {
    saveExperiences(experiences);
    await upsertExperiences(experiences);
    toast.success('Data pengalaman berhasil disimpan ke Cloud!');
  };

  const handleMigration = async () => {
    const ok = confirm('Apakah Anda yakin ingin mengunggah seluruh data lokal ke Supabase? Data yang ada di Cloud mungkin akan tertimpa.');
    if (!ok) return;
    
    const promise = seedSupabaseFromLocal();
    toast.promise(promise, {
      loading: 'Sedang memindahkan data ke Cloud...',
      success: 'Migrasi ke Cloud berhasil!',
      error: 'Gagal melakukan migrasi.'
    });
  };

  const handleImageUpload = (key: keyof EventSettings, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSlotImageUpload = (idx: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSlot(idx, 'image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSlot = () => {
    setSlots([...slots, { id: `NEW-${Date.now()}`, name: '', totalSlots: 0, position: '', image: '', available: true }]);
  };

  const removeSlot = (idx: number) => {
    setSlots(slots.filter((_, i) => i !== idx));
  };

  const updateSlot = (idx: number, field: keyof SlotConfig, value: string | boolean | number) => {
    setSlots(slots.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addTier = () => {
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setTiers([...tiers, { id, name: '', icon: 'award', color: 'bg-cream', benefits: '', price: '' }]);
  };

  const removeTier = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const updateTier = (idx: number, field: keyof PartnershipTier, value: string) => {
    setTiers(tiers.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const addMediaPartner = () => {
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setMediaPartners([...mediaPartners, { id, name: '', logo: '' }]);
  };

  const removeMediaPartner = (idx: number) => {
    setMediaPartners(mediaPartners.filter((_, i) => i !== idx));
  };

  const updateMediaPartner = (idx: number, field: keyof MediaPartnerConfig, value: string) => {
    setMediaPartners(mediaPartners.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleMediaLogoUpload = (idx: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateMediaPartner(idx, 'logo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addExperience = () => {
    const id = `id-${Date.now()}`;
    setExperiences([...experiences, { id, title: '', series: '', description: '', image: '' }]);
  };

  const removeExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  const updateExperience = (idx: number, field: keyof ExperienceItem, value: string) => {
    setExperiences(experiences.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const handleExperienceImageUpload = (idx: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateExperience(idx, 'image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { key: 'general' as const, label: 'Umum' },
    { key: 'slots' as const, label: 'Slot' },
    { key: 'experience' as const, label: 'Pengalaman' },
    { key: 'partnership' as const, label: 'Kemitraan' },
    { key: 'media' as const, label: 'Media Partner' },
    { key: 'backup' as const, label: 'Backup' },
  ];

  const inputClass = "kinput text-sm";
  const labelClass = "klabel text-nearblack/70 mb-1 block text-[10px]";

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-nearblack text-2xl">Pengaturan Event</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-accent font-semibold border-[3px] border-nearblack transition-all ${
              activeTab === tab.key ? 'bg-lime' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-6">
          {/* Event Info */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Informasi Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Nama Event</label>
                <input className={inputClass} value={settings.eventName} onChange={e => setSettings({ ...settings, eventName: e.target.value })} />
              </div>
              <div className="md:col-span-1">
                <label className={labelClass}>Penyelenggara</label>
                <input className={inputClass} value={settings.organizerName} onChange={e => setSettings({ ...settings, organizerName: e.target.value })} placeholder="Contoh: Dinas KUMKM Kota Metro" />
              </div>
              <div className="md:col-span-1">
                <label className={labelClass}>Tagline</label>
                <input className={inputClass} value={settings.eventTagline} onChange={e => setSettings({ ...settings, eventTagline: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Tanggal & Waktu</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Tanggal Mulai</label>
                <input type="date" className={inputClass} value={settings.startDate} onChange={e => setSettings({ ...settings, startDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Tanggal Selesai</label>
                <input type="date" className={inputClass} value={settings.endDate} onChange={e => setSettings({ ...settings, endDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Jam Mulai</label>
                <input type="time" className={inputClass} value={settings.startTime} onChange={e => setSettings({ ...settings, startTime: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Jam Selesai</label>
                <input type="time" className={inputClass} value={settings.endTime} onChange={e => setSettings({ ...settings, endTime: e.target.value })} />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>Deadline Pendaftaran</label>
              <input type="date" className={inputClass + " max-w-xs"} value={settings.registrationDeadline} onChange={e => setSettings({ ...settings, registrationDeadline: e.target.value })} />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Lokasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nama Lokasi</label>
                <input className={inputClass} value={settings.locationName} onChange={e => setSettings({ ...settings, locationName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Alamat</label>
                <input className={inputClass} value={settings.locationAddress} onChange={e => setSettings({ ...settings, locationAddress: e.target.value })} />
              </div>
            </div>
          </div>

          {/* SEO & Browser */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Tampilan Browser (SEO)</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass}>Teks di Tab Browser (Meta Title)</label>
                <input className={inputClass} value={settings.metaTitle} onChange={e => setSettings({ ...settings, metaTitle: e.target.value })} placeholder="KeMetroFest 2025" />
              </div>
              <div>
                <label className={labelClass}>Deskripsi Web (Meta Description) - Muncul di Google/Saat link disebar</label>
                <textarea className={`${inputClass} min-h-[80px] py-2`} value={settings.metaDescription} onChange={e => setSettings({ ...settings, metaDescription: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Pengaturan Tentang Acara */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Pengaturan "Tentang Acara"</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Teks Badge/Label (contoh: GRATIS)</label>
                <input className={inputClass} value={settings.aboutBadge} onChange={e => setSettings({ ...settings, aboutBadge: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Judul Bagian (contoh: Tujuan Kegiatan)</label>
                <input className={inputClass} value={settings.aboutTitle} onChange={e => setSettings({ ...settings, aboutTitle: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Isi Teks / Penjelasan (Pisahkan dengan Enter / Baris Baru)</label>
                <textarea className={`${inputClass} min-h-[120px] py-2`} value={settings.aboutDescription} onChange={e => setSettings({ ...settings, aboutDescription: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Foto Kegiatan (Upload)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Logo Header', key: 'logoImage' as const },
                { label: 'Hero Image', key: 'heroImage' as const },
                { label: 'About Image', key: 'aboutImage' as const },
                { label: 'Experience Image', key: 'experienceImage' as const },
                { label: 'Form Image', key: 'formImage' as const },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-2">
                  <label className={labelClass}>{label}</label>
                  {settings[key] && !settings[key].startsWith('/') && (
                    <img src={settings[key]} alt={label} className="w-full h-24 object-cover rounded-lg border border-nearblack" />
                  )}
                  {settings[key] && settings[key].startsWith('/') && (
                     <p className="text-xs text-nearblack/60 italic">Menggunakan gambar default</p>
                  )}
                  <input type="file" accept="image/*" className="text-sm" onChange={e => handleImageUpload(key, e.target.files?.[0] || null)} />
                </div>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Kontak & Bank</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>WhatsApp (tanpa +)</label>
                <input className={inputClass} value={settings.whatsappNumber} onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })} placeholder="6281234567890" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Nama Bank</label>
                <input className={inputClass} value={settings.bankName} onChange={e => setSettings({ ...settings, bankName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>No. Rekening</label>
                <input className={inputClass} value={settings.bankAccount} onChange={e => setSettings({ ...settings, bankAccount: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Nama Pemilik Rekening</label>
                <input className={inputClass} value={settings.bankHolder} onChange={e => setSettings({ ...settings, bankHolder: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Template Chat WA */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Template Chat WA</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass}>Pesan Pendaftaran Tenant (Gunakan placeholder: {'{businessName}, {contactName}, {phone}, {email}, {category}, {block}'})</label>
                <textarea className={`${inputClass} min-h-[140px] py-2`} value={settings.waTemplateTenant} onChange={e => setSettings({ ...settings, waTemplateTenant: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Pesan Default Calon Mitra/Sponsor</label>
                <textarea className={`${inputClass} min-h-[80px] py-2`} value={settings.waTemplatePartner} onChange={e => setSettings({ ...settings, waTemplatePartner: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Pesan Default Calon Media Partner</label>
                <textarea className={`${inputClass} min-h-[80px] py-2`} value={settings.waTemplateMedia} onChange={e => setSettings({ ...settings, waTemplateMedia: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display font-bold text-nearblack text-lg mb-4">Media Sosial</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input className={inputClass} value={settings.instagramUrl} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={settings.showInstagram} onChange={e => setSettings({ ...settings, showInstagram: e.target.checked })} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm font-body text-nearblack/70">Tampilkan di Web</span>
                </label>
              </div>
              <div>
                <label className={labelClass}>YouTube URL</label>
                <input className={inputClass} value={settings.youtubeUrl} onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={settings.showYoutube} onChange={e => setSettings({ ...settings, showYoutube: e.target.checked })} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm font-body text-nearblack/70">Tampilkan di Web</span>
                </label>
              </div>
              <div>
                <label className={labelClass}>Facebook URL</label>
                <input className={inputClass} value={settings.facebookUrl} onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={settings.showFacebook} onChange={e => setSettings({ ...settings, showFacebook: e.target.checked })} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <span className="text-sm font-body text-nearblack/70">Tampilkan di Web</span>
                </label>
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} className="kbtn-primary flex items-center gap-2">
            <Save className="w-5 h-5" /> Simpan Pengaturan
          </button>
        </div>
      )}

      {/* Slots Settings */}
      {activeTab === 'slots' && (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-nearblack text-lg">Pengaturan Slot</h3>
            <button onClick={addSlot} className="kbtn-primary text-sm py-2 px-4 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {slots.map((slot, idx) => (
            <div key={idx} className="border-2 border-nearblack rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nama / Blok</label>
                  <input className={inputClass} value={slot.name} onChange={e => updateSlot(idx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Total Slot</label>
                  <input type="number" className={inputClass} value={slot.totalSlots || 0} onChange={e => updateSlot(idx, 'totalSlots', parseInt(e.target.value) || 0)} placeholder="Misal: 10" />
                </div>
                <div>
                  <label className={labelClass}>Posisi</label>
                  <input className={inputClass} value={slot.position} onChange={e => updateSlot(idx, 'position', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Gambar Slot (Upload)</label>
                  <div className="flex flex-col gap-2">
                    {slot.image && <img src={slot.image} alt="Slot" className="h-16 w-16 object-cover rounded border border-nearblack" />}
                    <input type="file" accept="image/*" className="text-sm" onChange={e => handleSlotImageUpload(idx, e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={slot.available} onChange={e => updateSlot(idx, 'available', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-nearblack accent-lime" />
                  <span className="font-accent text-sm font-semibold">Tersedia</span>
                </label>
                <button onClick={() => removeSlot(idx)}
                  className="w-8 h-8 rounded-lg border border-nearblack flex items-center justify-center hover:bg-coral/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleSaveSlots} className="kbtn-primary flex items-center gap-2">
            <Save className="w-5 h-5" /> Simpan Slot
          </button>
        </div>
      )}

      {/* Partnership Settings */}
      {activeTab === 'partnership' && (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-nearblack text-lg">Paket Kemitraan</h3>
            <button onClick={addTier} className="kbtn-primary text-sm py-2 px-4 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {tiers.map((tier, idx) => (
            <div key={idx} className="border-2 border-nearblack rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Nama Tier</label>
                  <input className={inputClass} value={tier.name} onChange={e => updateTier(idx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Harga</label>
                  <input className={inputClass} value={tier.price} onChange={e => updateTier(idx, 'price', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Icon</label>
                  <select className="kselect text-sm" value={tier.icon} onChange={e => updateTier(idx, 'icon', e.target.value)}>
                    <option value="crown">Crown</option>
                    <option value="gem">Gem</option>
                    <option value="award">Award</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Warna</label>
                  <select className="kselect text-sm" value={tier.color} onChange={e => updateTier(idx, 'color', e.target.value)}>
                    <option value="bg-mint">Mint</option>
                    <option value="bg-sky">Sky</option>
                    <option value="bg-cream">Cream</option>
                    <option value="bg-lavender">Lavender</option>
                    <option value="bg-coral">Coral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Benefit</label>
                <input className={inputClass} value={tier.benefits} onChange={e => updateTier(idx, 'benefits', e.target.value)} />
              </div>
              <div className="flex justify-end">
                <button onClick={() => removeTier(idx)}
                  className="w-8 h-8 rounded-lg border border-nearblack flex items-center justify-center hover:bg-coral/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleSaveTiers} className="kbtn-primary flex items-center gap-2">
            <Save className="w-5 h-5" /> Simpan Kemitraan
          </button>
        </div>
      )}

      {/* Media Partner Settings */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-nearblack text-lg">Logo Media Partner (Landing Page)</h3>
            <button onClick={addMediaPartner} className="kbtn-primary text-sm py-2 px-4 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {mediaPartners.map((mp, idx) => (
            <div key={idx} className="border-2 border-nearblack rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded border border-nearblack bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {mp.logo ? (
                    <img src={mp.logo} alt={mp.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-[10px] text-gray-400">No Logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className={labelClass}>Nama Media</label>
                    <input className={inputClass} value={mp.name} onChange={e => updateMediaPartner(idx, 'name', e.target.value)} placeholder="Contoh: Radio FM" />
                  </div>
                  <div>
                    <label className={labelClass}>Upload Logo</label>
                    <input type="file" accept="image/*" className="text-sm" onChange={e => handleMediaLogoUpload(idx, e.target.files?.[0] || null)} />
                  </div>
                </div>
                <button onClick={() => removeMediaPartner(idx)}
                  className="w-10 h-10 rounded-xl border-2 border-nearblack flex items-center justify-center hover:bg-coral/20 self-start">
                  <Trash2 className="w-5 h-5 text-coral" />
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleSaveMediaPartners} className="kbtn-primary flex items-center gap-2">
            <Save className="w-5 h-5" /> Simpan Media Partner
          </button>
        </div>
      )}

      {/* Experience Settings */}
      {activeTab === 'experience' && (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-nearblack text-lg">Kartu Pengalaman Event</h3>
            <button onClick={addExperience} className="kbtn-primary text-sm py-2 px-4 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Tambah Kartu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp, idx) => (
              <div key={idx} className="border-2 border-nearblack rounded-xl p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-accent font-bold text-nearblack/40">KARTU #{idx + 1}</span>
                  <button onClick={() => removeExperience(idx)} className="text-coral hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Acara</label>
                    <input className={inputClass} value={exp.title} onChange={e => updateExperience(idx, 'title', e.target.value)} placeholder="Contoh: Pasar Malam" />
                  </div>
                  <div>
                    <label className={labelClass}>Series</label>
                    <input className={inputClass} value={exp.series} onChange={e => updateExperience(idx, 'series', e.target.value)} placeholder="Contoh: Series 1" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Keterangan Singkat</label>
                  <textarea className={`${inputClass} min-h-[80px] py-2`} value={exp.description} onChange={e => updateExperience(idx, 'description', e.target.value)} />
                </div>

                <div>
                  <label className={labelClass}>Foto Event</label>
                  <div className="flex items-center gap-3">
                    {exp.image && <img src={exp.image} className="w-12 h-12 object-cover rounded-lg border border-nearblack" />}
                    <label className="flex-1 px-3 py-2 bg-white border border-nearblack rounded-lg text-[10px] cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                      <Camera className="w-3 h-3" /> Pilih Foto
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleExperienceImageUpload(idx, e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSaveExperiences} className="kbtn-primary flex items-center gap-2">
            <Save className="w-5 h-5" /> Simpan Pengalaman
          </button>
        </div>
      )}

      {/* Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-[3px] border-nearblack p-8">
            <h3 className="font-display font-bold text-nearblack text-xl mb-2 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" /> Cadangan Data (Backup)
            </h3>
            <p className="font-body text-nearblack/60 mb-8 text-sm">
              Gunakan fitur ini untuk mengamankan data Anda. Karena aplikasi ini menggunakan penyimpanan lokal (browser), 
              sangat disarankan untuk melakukan backup secara rutin agar data tidak hilang jika Anda menghapus cache browser.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Section */}
              <div className="space-y-4 p-6 border-2 border-dashed border-nearblack/20 rounded-2xl">
                <h4 className="font-accent font-bold text-nearblack uppercase tracking-wider text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> Ekspor Data
                </h4>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      const data: any = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key?.startsWith('kmf_')) {
                          data[key] = JSON.parse(localStorage.getItem(key) || '{}');
                        }
                      }
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_kemetrofest_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="kbtn-primary flex items-center justify-center gap-2 py-3"
                  >
                    <Download className="w-5 h-5" /> Download Backup (.json)
                  </button>
                  <button 
                    onClick={() => {
                      let sql = `-- KeMetroFest Database Dump\n-- Generated on ${new Date().toLocaleString()}\n\n`;
                      
                      // Handle Tenants
                      const tenants = JSON.parse(localStorage.getItem('kmf_tenants') || '[]');
                      if (tenants.length > 0) {
                        sql += `-- TABLE tenants\n`;
                        tenants.forEach((t: any) => {
                          const fields = Object.keys(t).join(', ');
                          const values = Object.values(t).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ');
                          sql += `INSERT INTO tenants (${fields}) VALUES (${values});\n`;
                        });
                        sql += `\n`;
                      }

                      // Handle Partners
                      const partners = JSON.parse(localStorage.getItem('kmf_partners') || '[]');
                      if (partners.length > 0) {
                        sql += `-- TABLE partners\n`;
                        partners.forEach((p: any) => {
                          const fields = Object.keys(p).join(', ');
                          const values = Object.values(p).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ');
                          sql += `INSERT INTO partners (${fields}) VALUES (${values});\n`;
                        });
                        sql += `\n`;
                      }

                      const blob = new Blob([sql], { type: 'text/sql' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_kemetrofest_${new Date().toISOString().split('T')[0]}.sql`;
                      a.click();
                    }}
                    className="kbtn bg-white border-2 border-nearblack flex items-center justify-center gap-2 py-3 hover:bg-gray-50"
                  >
                    <FileCode className="w-5 h-5" /> Ekspor ke Format SQL (.sql)
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="space-y-4 p-6 border-2 border-dashed border-nearblack/20 rounded-2xl">
                <h4 className="font-accent font-bold text-nearblack uppercase tracking-wider text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Pulihkan Data (Restore)
                </h4>
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] text-nearblack/50 leading-tight">
                    Unggah file backup (.json) untuk memulihkan data. <br/>
                    <span className="text-coral font-bold">PERINGATAN:</span> Data saat ini akan ditimpa sepenuhnya!
                  </p>
                  <label className="kbtn-secondary flex items-center justify-center gap-2 py-3 cursor-pointer">
                    <Upload className="w-5 h-5" /> Unggah & Pulihkan
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm('Apakah Anda yakin? Data saat ini akan dihapus dan diganti dengan data dari file backup.')) return;
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            Object.keys(data).forEach(key => {
                              if (key.startsWith('kmf_')) {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                              }
                            });
                            alert('Data berhasil dipulihkan! Halaman akan dimuat ulang.');
                            window.location.reload();
                          } catch (err) {
                            alert('File tidak valid atau korup!');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Cloud Migration */}
            <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-sky/30 rounded-xl flex items-center justify-center border-2 border-nearblack">
                  <Cloud className="w-6 h-6 text-nearblack" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-nearblack text-lg">Migrasi Cloud (Supabase)</h3>
                  <p className="text-xs text-nearblack/60">Pindahkan semua data lokal saat ini ke database online.</p>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                <p className="text-sm text-amber-800 leading-relaxed">
                  Gunakan fitur ini hanya sekali saat pertama kali menyiapkan database Supabase Anda untuk memastikan data yang ada di laptop Anda terunggah ke server.
                </p>
              </div>

              <button 
                onClick={handleMigration}
                className="kbtn-secondary flex items-center gap-2 w-full justify-center py-4"
              >
                <Cloud className="w-5 h-5" /> Mulai Migrasi ke Cloud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
