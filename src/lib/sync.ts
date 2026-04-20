import { fetchSettings, fetchSlots, fetchTiers, fetchExperiences, fetchTenants, fetchPartners } from './supabase_store';
import { saveSettings, saveSlots, saveTiers, saveExperiences, saveTenants, savePartners } from './store';

export const syncFromCloud = async () => {
  try {
    const [settings, slots, tiers, experiences, tenants, partners] = await Promise.all([
      fetchSettings(),
      fetchSlots(),
      fetchTiers(),
      fetchExperiences(),
      fetchTenants(),
      fetchPartners()
    ]);

    if (settings) saveSettings(settings);
    if (slots.length) saveSlots(slots);
    if (tiers.length) saveTiers(tiers);
    if (experiences.length) saveExperiences(experiences);
    if (tenants.length) saveTenants(tenants);
    if (partners.length) savePartners(partners);
    
    // Trigger a storage event so other tabs/components update
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (err) {
    console.error('Failed to sync from cloud:', err);
    return false;
  }
};
