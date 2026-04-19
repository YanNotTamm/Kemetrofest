import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Users, Handshake, Settings, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', icon: Home, label: 'Beranda', end: true },
  { to: '/admin/tenants', icon: Users, label: 'Data Tenant', end: false },
  { to: '/admin/partners', icon: Handshake, label: 'Data Partner', end: false },
  { to: '/admin/settings', icon: Settings, label: 'Pengaturan', end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-nearblack text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-white/10">
          <h1 className="font-display font-black text-xl text-lime tracking-tight">
            KeMetroFest
          </h1>
          <p className="font-body text-white/50 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-accent font-semibold transition-all ${
                  isActive
                    ? 'bg-lime text-nearblack'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-accent font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Web
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 rounded-lg border-2 border-nearblack flex items-center justify-center"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h2 className="font-display font-bold text-nearblack text-lg">Admin Dashboard</h2>
        </header>

        {/* Content */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
