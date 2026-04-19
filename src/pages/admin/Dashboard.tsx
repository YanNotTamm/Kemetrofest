import { Users, Handshake, MapPin, CalendarDays } from 'lucide-react';
import { getTenants, getPartners, getSlots, getSettings } from '@/lib/store';

export default function Dashboard() {
  const tenants = getTenants();
  const partners = getPartners();
  const slots = getSlots();
  const settings = getSettings();

  const totalSlots = slots.reduce((acc, slot) => acc + (slot.totalSlots || 0), 0);
  const filledSlots = tenants.filter(t => t.status === 'approved').length;
  const availableSlots = Math.max(0, totalSlots - filledSlots);

  const stats = [
    { icon: Users, label: 'Total Tenant', value: tenants.length, color: 'bg-lavender' },
    { icon: Handshake, label: 'Total Partner', value: partners.length, color: 'bg-mint' },
    { icon: MapPin, label: 'Slot Tersedia', value: `${availableSlots}/${totalSlots}`, color: 'bg-sky' },
    { icon: CalendarDays, label: 'Tanggal Event', value: new Date(settings.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'bg-cream' },
  ];

  const pendingTenants = tenants.filter(t => t.status === 'pending');

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-nearblack text-2xl">Beranda</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl border-[3px] border-nearblack p-5`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-5 h-5 text-nearblack" />
              <span className="font-accent font-semibold text-nearblack/70 text-xs uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="font-display font-black text-nearblack text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Pending */}
      <div className="bg-white rounded-2xl border-[3px] border-nearblack p-5">
        <h2 className="font-display font-bold text-nearblack text-lg mb-4">
          Tenant Pending ({pendingTenants.length})
        </h2>
        {pendingTenants.length === 0 ? (
          <p className="font-body text-nearblack/50 text-sm">Belum ada pendaftaran baru.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-nearblack">
                  <th className="font-accent font-semibold text-xs uppercase text-nearblack/70 pb-2 pr-4">Nama Usaha</th>
                  <th className="font-accent font-semibold text-xs uppercase text-nearblack/70 pb-2 pr-4">PIC</th>
                  <th className="font-accent font-semibold text-xs uppercase text-nearblack/70 pb-2 pr-4">Kategori</th>
                  <th className="font-accent font-semibold text-xs uppercase text-nearblack/70 pb-2 pr-4">Blok</th>
                  <th className="font-accent font-semibold text-xs uppercase text-nearblack/70 pb-2">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {pendingTenants.slice(0, 5).map(t => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="font-body text-nearblack text-sm py-3 pr-4">{t.businessName}</td>
                    <td className="font-body text-nearblack/80 text-sm py-3 pr-4">{t.contactName}</td>
                    <td className="font-body text-nearblack/80 text-sm py-3 pr-4">{t.category}</td>
                    <td className="font-body text-nearblack/80 text-sm py-3 pr-4">Blok {t.block}</td>
                    <td className="font-body text-nearblack/60 text-xs py-3">{new Date(t.submittedAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slot Allocation Summary */}
      <div className="bg-white rounded-2xl border-[3px] border-nearblack p-5">
        <h2 className="font-display font-bold text-nearblack text-lg mb-4">
          Alokasi Slot Tenant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map(slot => {
            const slotTenants = tenants.filter(t => t.block === slot.id && t.status === 'approved');
            const remaining = Math.max(0, (slot.totalSlots || 0) - slotTenants.length);
            
            return (
              <div key={slot.id} className="border-2 border-nearblack rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-display font-bold text-nearblack">{slot.name}</h3>
                    <p className="font-body text-xs text-nearblack/60">{slot.position}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-accent font-semibold text-xs px-2 py-1 bg-lime border border-nearblack rounded-lg">
                      Sisa: {remaining}/{slot.totalSlots || 0}
                    </span>
                  </div>
                </div>
                
                {slotTenants.length > 0 ? (
                  <ul className="space-y-2">
                    {slotTenants.map(t => (
                      <li key={t.id} className="flex justify-between items-center text-sm font-body border-b border-gray-100 pb-1 last:border-0">
                        <span>{t.businessName}</span>
                        <span className="font-accent font-semibold text-xs text-nearblack/70 bg-gray-100 px-2 py-0.5 rounded">
                          {t.assignedSlot || 'Belum di-assign'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-body text-nearblack/50 italic">Belum ada tenant di blok ini.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
