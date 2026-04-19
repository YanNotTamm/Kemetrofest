import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pattern-dots text-nearblack font-body">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-nearblack font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
        
        <div className="bg-white rounded-3xl border-[3px] border-nearblack shadow-hard p-8 md:p-12">
          <h1 className="font-display font-black text-3xl md:text-5xl mb-6">Kebijakan Privasi</h1>
          <p className="text-sm text-nearblack/60 mb-8">Terakhir Diperbarui: 19 April 2026</p>
          
          <div className="space-y-6 text-nearblack/80 leading-relaxed">
            <p>
              Selamat datang di KeMetroFest. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda mengunjungi situs web kami atau berpartisipasi dalam acara kami.
            </p>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara langsung kepada kami, seperti saat Anda mendaftar sebagai tenant, mendaftar sebagai mitra (sponsor/media), atau menghubungi kami. Informasi tersebut dapat mencakup:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nama lengkap atau nama perusahaan</li>
              <li>Alamat email</li>
              <li>Nomor telepon / WhatsApp</li>
              <li>Data terkait usaha (untuk pendaftaran tenant)</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">2. Penggunaan Informasi</h2>
            <p>
              Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Memproses pendaftaran tenant dan kemitraan.</li>
              <li>Berkomunikasi dengan Anda mengenai detail acara, pembaruan, dan layanan pelanggan.</li>
              <li>Meningkatkan layanan dan pengalaman pengunjung di masa mendatang.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">3. Penyimpanan Data</h2>
            <p>
              Kami menggunakan teknologi penyimpanan lokal (Local Storage) di peramban Anda untuk menyimpan data operasional situs web. Data pendaftaran dikirimkan langsung melalui platform pihak ketiga (seperti WhatsApp) kepada panitia penyelenggara.
            </p>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">4. Pembagian Informasi</h2>
            <p>
              Kami tidak akan menjual, menyewakan, atau menukar informasi pribadi Anda kepada pihak ketiga. Kami hanya dapat membagikan informasi Anda dalam kondisi:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dengan penyedia layanan pihak ketiga yang membantu kami mengoperasikan acara (atas dasar kerahasiaan ketat).</li>
              <li>Jika diwajibkan oleh hukum atau permintaan resmi dari pihak berwenang.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">5. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui kontak WhatsApp atau email yang tertera di halaman utama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
