import { useState } from 'react';
import { getPartners, savePartners, addPartner } from '@/lib/store';
import type { PartnerData } from '@/lib/store';
import { Plus, Trash2, X, Pencil } from 'lucide-react';

export default function Partners() {
  const [partners, setPartners] = useState<PartnerData[]>(getPartners());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'media' as 'media' | 'sponsor', tier: '', contactPerson: '', phone: '', email: '', status: 'active' as 'active' | 'inactive', logo: '' });
  const [editingPartner, setEditingPartner] = useState<PartnerData | null>(null);

  const saveEdit = () => {
    if (!editingPartner) return;
    const updated = partners.map(p => p.id === editingPartner.id ? editingPartner : p);
    setPartners(updated);
    savePartners(updated);
    setEditingPartner(null);
  };

  const handleAdd = () => {
    if (!form.name || !form.contactPerson) return;
    const newP = addPartner(form);
    setPartners([...partners, newP]);
    setForm({ name: '', type: 'media', tier: '', contactPerson: '', phone: '', email: '', status: 'active', logo: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus data partner ini?')) return;
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    savePartners(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = partners.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const } : p);
    setPartners(updated);
    savePartners(updated);
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-nearblack text-2xl">Data Partner</h1>
        <button onClick={() => setShowForm(true)} className="kbtn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Partner
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-[3px] border-nearblack p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-nearblack text-lg">Tambah Partner</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg border-2 border-nearblack flex items-center justify-center hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="klabel text-nearblack/70 mb-1 block">Nama</label>
                <input className="kinput" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama partner" />
              </div>
              <div>
                <label className="klabel text-nearblack/70 mb-1 block">Logo Partner</label>
                <div className="flex items-center gap-3">
                  {form.logo && <img src={form.logo} alt="Logo" className="w-12 h-12 object-contain bg-gray-100 rounded border border-nearblack" />}
                  <input type="file" accept="image/*" onChange={e => handleLogoUpload(e.target.files?.[0] || null)} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="klabel text-nearblack/70 mb-1 block">Tipe</label>
                  <select className="kselect" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'media' | 'sponsor' })}>
                    <option value="media">Media</option>
                    <option value="sponsor">Sponsor</option>
                  </select>
                </div>
                <div>
                  <label className="klabel text-nearblack/70 mb-1 block">Tier</label>
                  <input className="kinput" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} placeholder="Gold, Platinum..." />
                </div>
              </div>
              <div>
                <label className="klabel text-nearblack/70 mb-1 block">Kontak Person</label>
                <input className="kinput" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Nama PIC" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="klabel text-nearblack/70 mb-1 block">Telepon</label>
                  <input className="kinput" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0812..." />
                </div>
                <div>
                  <label className="klabel text-nearblack/70 mb-1 block">Email</label>
                  <input className="kinput" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@..." />
                </div>
              </div>
              <button onClick={handleAdd} className="w-full kbtn-primary mt-2">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {partners.length === 0 ? (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack p-10 text-center">
          <p className="font-body text-nearblack/50">Belum ada data partner. Klik "Tambah Partner" untuk memulai.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-[3px] border-nearblack overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-nearblack bg-gray-50">
                  {['Logo', 'Nama', 'Tipe', 'Tier', 'Kontak', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="font-accent font-semibold text-xs uppercase text-nearblack/70 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partners.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      {p.logo ? (
                        <img src={p.logo} alt={p.name} className="w-10 h-10 object-contain bg-white rounded border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </td>
                    <td className="font-body text-nearblack text-sm px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-accent font-semibold border border-nearblack ${p.type === 'sponsor' ? 'bg-lavender' : 'bg-sky'}`}>
                        {p.type === 'sponsor' ? 'Sponsor' : 'Media'}
                      </span>
                    </td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{p.tier || '-'}</td>
                    <td className="font-body text-nearblack/80 text-sm px-4 py-3">{p.contactPerson}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(p.id)}
                        className={`px-2 py-1 rounded-full text-xs font-accent font-semibold border border-nearblack cursor-pointer ${p.status === 'active' ? 'bg-mint' : 'bg-gray-200'}`}>
                        {p.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setEditingPartner(p)} title="Edit"
                          className="w-7 h-7 rounded-lg bg-white border border-nearblack flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} title="Hapus"
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

      {/* Edit Form Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-nearblack/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border-[3px] border-nearblack w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-[3px] border-nearblack sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-2xl text-nearblack">Edit Data Partner</h2>
              <button onClick={() => setEditingPartner(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-nearblack" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Tipe Partner</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={editingPartner.type === 'media'} onChange={() => setEditingPartner({ ...editingPartner, type: 'media', tier: '' })} />
                    <span className="text-sm font-body">Media Partner</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={editingPartner.type === 'sponsor'} onChange={() => setEditingPartner({ ...editingPartner, type: 'sponsor' })} />
                    <span className="text-sm font-body">Sponsor</span>
                  </label>
                </div>
              </div>
              
              {editingPartner.type === 'sponsor' && (
                <div>
                  <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Tier / Kategori</label>
                  <input className="kinput" placeholder="Contoh: Gold, Platinum" value={editingPartner.tier} onChange={e => setEditingPartner({ ...editingPartner, tier: e.target.value })} />
                </div>
              )}

              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Nama Instansi/Perusahaan</label>
                <input className="kinput" value={editingPartner.name} onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Nama Kontak</label>
                  <input className="kinput" value={editingPartner.contactPerson} onChange={e => setEditingPartner({ ...editingPartner, contactPerson: e.target.value })} />
                </div>
                <div>
                  <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">No. WhatsApp</label>
                  <input className="kinput" value={editingPartner.phone} onChange={e => setEditingPartner({ ...editingPartner, phone: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block font-accent font-semibold text-sm mb-1 text-nearblack/80 uppercase">Logo (Opsional)</label>
                {editingPartner.logo && (
                  <img src={editingPartner.logo} alt="Logo Preview" className="h-16 mb-2 object-contain bg-gray-50 border border-nearblack rounded-lg" />
                )}
                <input type="file" accept="image/*" className="text-sm" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => setEditingPartner({ ...editingPartner, logo: reader.result as string });
                  reader.readAsDataURL(file);
                }} />
              </div>

              <div className="pt-4 border-t-2 border-dashed border-gray-200">
                <button onClick={saveEdit} className="kbtn-primary w-full">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
