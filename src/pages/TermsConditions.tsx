import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white pattern-dots text-nearblack font-body">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-nearblack font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
        
        <div className="bg-white rounded-3xl border-[3px] border-nearblack shadow-hard p-8 md:p-12">
          <h1 className="font-display font-black text-3xl md:text-5xl mb-6">Syarat & Ketentuan</h1>
          <p className="text-sm text-nearblack/60 mb-8">Terakhir Diperbarui: 19 April 2026</p>
          
          <div className="space-y-6 text-nearblack/80 leading-relaxed">
            <p>
              Mohon membaca Syarat dan Ketentuan ini dengan saksama sebelum mendaftar atau berpartisipasi dalam acara KeMetroFest. Dengan mengakses situs web kami atau mendaftar sebagai peserta/tenant, Anda menyetujui syarat-syarat berikut.
            </p>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">1. Ketentuan Umum</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>KeMetroFest adalah acara festival tahunan yang diselenggarakan oleh panitia penyelenggara resmi.</li>
              <li>Pihak penyelenggara berhak mengubah jadwal, lokasi, atau rangkaian acara dalam keadaan force majeure atau kondisi tak terduga lainnya.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">2. Pendaftaran Tenant</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pendaftaran tenant hanya sah jika dilakukan melalui prosedur resmi (form pendaftaran di website dan konfirmasi via WhatsApp resmi).</li>
              <li>Pengalokasian blok/stan adalah kewenangan penuh panitia berdasarkan ketersediaan dan jenis usaha.</li>
              <li>Penyewa stan bertanggung jawab penuh atas kebersihan, keamanan barang bawaan, dan kepatuhan terhadap hukum selama berjualan di area festival.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">3. Kebijakan Pembatalan & Pengembalian Dana (Refund)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uang muka (DP) atau pelunasan sewa stan yang telah dibayarkan <strong>tidak dapat dikembalikan (non-refundable)</strong> apabila pembatalan dilakukan sepihak oleh penyewa.</li>
              <li>Jika acara dibatalkan secara sepihak oleh penyelenggara, pengembalian dana akan diproses sesuai dengan kebijakan yang akan diumumkan kemudian.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">4. Keamanan dan Tata Tertib</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Setiap pengunjung dan tenant diwajibkan untuk menjaga ketertiban umum.</li>
              <li>Dilarang keras membawa senjata tajam, obat-obatan terlarang, minuman keras, atau barang-barang berbahaya lainnya ke dalam area acara.</li>
              <li>Panitia berhak mengeluarkan pihak yang dianggap mengganggu keamanan dan kelancaran acara tanpa kompensasi apa pun.</li>
            </ul>

            <h2 className="font-display font-bold text-xl text-nearblack mt-8">5. Perubahan Syarat dan Ketentuan</h2>
            <p>
              Penyelenggara berhak memperbarui atau mengubah Syarat & Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
