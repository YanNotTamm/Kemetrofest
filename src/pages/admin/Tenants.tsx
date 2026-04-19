import { useState } from 'react';
import { getTenants, saveTenants } from '@/lib/store';
import type { TenantSubmission } from '@/lib/store';
import { CheckCircle2, XCircle, Clock, Trash2, Pencil, X } from 'lucide-react';

export default function Tenants() {
  const [tenants, setTenants] = useState<TenantSubmission[]>(getTenants());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingTenant, setEditingTenant] = useState<TenantSubmission | null>(null);

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    const updated = tenants.map(t => t.id === editingTenant.id ? editingTenant : t);
    setTenants(updated);
    saveTenants(updated);
    setEditingTenant(null);
  };

  const updateStatus = (id: string, status: TenantSubmission['status']) => {
    const updated = tenants.map(t => t.id === id ? { ...t, status } : t);
    setTenants(updated);
    saveTenants(updated);
  };

  const updateAssignedSlot = (id: string, assignedSlot: string) => {
    const updated = tenants.map(t => t.id === id ? { ...t, assignedSlot } : t);
    setTenants(updated);
    saveTenants(updated);
  };

  const deleteTenant = (id: string) => {
    if (!confirm('Hapus data tenant ini?')) return;
    const updated = tenants.filter(t => t.id !== id);
    setTenants(updated);
    saveTenants(updated);
  };

  const filtered = filterStatus === 'all' ? tenants : tenants.filter(t => t.status === filterStatus);

  const statusBadge = (status: TenantSubmission['status']) => {
    const map = {
      pending: { icon: Clock, bg: 'bg-cream', label: 'Pending' },
      approved: { icon: CheckCircle2, bg: 'bg-mint', label: 'Approved' },
      rejected: { icon: XCircle, bg: 'bg-coral/30', label: 'Rejected' },
    };
    const { icon: Icon, bg, label } = map[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-accent font-semibold ${bg} border border-nearblack`}>
        <Icon className="w-3 h-3" />{label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display font-bold text-nearblack text-2xl">Data Tenant</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-accent font-semibold border-2 border-nearblack transition-all ${
                filterStatus === s ? 'bg-lime' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? tenants.length : tenants.filter(t => t.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-10 text-center">
          <p className="font-body text-nearblack/50">Belum ada data tenant.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-nearblack bg-gray-50">
                  {['Nama Usaha', 'PIC', 'WhatsApp', 'Email', 'Kategori', 'Blok', 'No. Slot', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="font-accent font-semibold text-xs uppercase text-nearblack/70 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="font-body text-nearblack text-sm px-4 py-3 font-semibold">{t.businessName}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{t.contactName}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{t.phone}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{t.email}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{t.category}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">Blok {t.block}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">
                      {t.status === 'approved' ? (
                        <input 
                          className="kinput text-xs px-2 py-1 w-20" 
                          placeholder="Misal: A1" 
                          value={t.assignedSlot || ''} 
                          onChange={(e) => updateAssignedSlot(t.id, e.target.value)} 
                        />
                      ) : (
                        <span className="text-nearblack/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {t.status !== 'approved' && (
                          <button onClick={() => updateStatus(t.id, 'approved')} title="Approve"
                            className="w-7 h-7 rounded-lg bg-mint border border-nearblack flex items-center justify-center hover:scale-105 transition-transform">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {t.status !== 'rejected' && (
                          <button onClick={() => updateStatus(t.id, 'rejected')} title="Reject"
                            className="w-7 h-7 rounded-lg bg-coral/30 border border-nearblack flex items-center justify-center hover:scale-105 transition-transform">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setEditingTenant(t)} title="Edit"
                          className="w-7 h-7 rounded-lg bg-white border border-nearblack flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteTenant(t.id)} title="Hapus"
                          className="w-7 h-7 rounded-lg bg-white border border-nearblack flex items-center justify-center hover:bg-coral/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nearblack/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-[3px] border-nearblack w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-[3px] border-nearblack sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-2xl text-nearblack">Edit Data Tenant</h2>
              <button onClick={() => setEditingTenant(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-nearblack" />
              </button>
            </div>
            
            <form onSubmit={saveEdit} className="p-6 space-y-4">
              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Nama Usaha</label>
                <input required className="kinput" value={editingTenant.businessName} onChange={e => setEditingTenant({...editingTenant, businessName: e.target.value})} />
              </div>
              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Nama PIC</label>
                <input required className="kinput" value={editingTenant.contactName} onChange={e => setEditingTenant({...editingTenant, contactName: e.target.value})} />
              </div>
              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">WhatsApp</label>
                <input required className="kinput" value={editingTenant.phone} onChange={e => setEditingTenant({...editingTenant, phone: e.target.value})} />
              </div>
              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Email</label>
                <input type="email" required className="kinput" value={editingTenant.email} onChange={e => setEditingTenant({...editingTenant, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Kategori</label>
                  <select className="kinput" value={editingTenant.category} onChange={e => setEditingTenant({...editingTenant, category: e.target.value as any})}>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Kriya">Kriya</option>
                    <option value="Jasa">Jasa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Blok</label>
                  <input required className="kinput" value={editingTenant.block} onChange={e => setEditingTenant({...editingTenant, block: e.target.value})} />
                </div>
              </div>
              
              <div className="pt-4 border-t-2 border-dashed border-gray-200">
                <button type="submit" className="kbtn-primary w-full">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
