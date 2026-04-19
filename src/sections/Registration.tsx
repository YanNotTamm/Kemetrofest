import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, categories, type RegistrationFormData } from '@/lib/registrationSchema';
import { addTenant, getSettings, getSlots } from '@/lib/store';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function Registration() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const settings = getSettings();
  const slots = getSlots();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: { businessName: '', contactName: '', phone: '', email: '', category: '', block: '' },
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(photoRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 50%', scrub: true }
        }
      );
      gsap.fromTo(formRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 50%', scrub: true }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const onSubmit = (data: RegistrationFormData) => {
    // Save to localStorage
    addTenant(data);

    // Build WhatsApp message using template
    const blockName = slots.find(s => s.id === data.block)?.name || data.block;
    let message = settings.waTemplateTenant || 'Pendaftaran Stan:\nNama: {businessName}\nPIC: {contactName}';
    
    message = message.replace(/{businessName}/g, data.businessName);
    message = message.replace(/{contactName}/g, data.contactName);
    message = message.replace(/{phone}/g, data.phone);
    message = message.replace(/{email}/g, data.email);
    message = message.replace(/{category}/g, data.category);
    message = message.replace(/{block}/g, blockName);

    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;

    toast.success('🎉 Pendaftaran berhasil! Mengarahkan ke WhatsApp...');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1000);

    reset();
  };

  const fieldClass = (hasError: boolean) =>
    `kinput ${hasError ? 'border-coral ring-2 ring-coral/30' : ''}`;

  const selectClass = (hasError: boolean) =>
    `kselect ${hasError ? 'border-coral ring-2 ring-coral/30' : ''}`;

  return (
    <section
      ref={sectionRef}
      id="register"
      className="w-full bg-neon py-16 md:py-24 px-[5vw]"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Photo */}
        <div ref={photoRef} className="lg:w-[42%] kcard-mint overflow-hidden flex-shrink-0 flex">
          <img
            src={settings.formImage}
            alt="Festival Crowd"
            className="w-full h-full min-h-[300px] md:min-h-[520px] object-cover"
          />
        </div>

        {/* Form */}
        <div ref={formRef} className="flex-1 kcard-lavender p-6 md:p-10">
          <h2 className="kheading text-[clamp(1.8rem,3vw,2.8rem)] text-nearblack mb-2">
            Daftarkan Tenant Saya
          </h2>
          <p className="font-body text-nearblack/70 text-sm mb-6">
            Isi form di bawah, lalu Anda akan diarahkan ke WhatsApp untuk konfirmasi.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="klabel text-nearblack/70 mb-1.5 block">Nama Usaha</label>
              <input type="text" className={fieldClass(!!errors.businessName)} placeholder="Contoh: Warung Nasi Goreng Pak Budi" {...register('businessName')} />
              {errors.businessName && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="klabel text-nearblack/70 mb-1.5 block">Nama Penanggung Jawab</label>
              <input type="text" className={fieldClass(!!errors.contactName)} placeholder="Nama lengkap" {...register('contactName')} />
              {errors.contactName && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.contactName.message}</p>}
            </div>

            <div>
              <label className="klabel text-nearblack/70 mb-1.5 block">No. WhatsApp</label>
              <input type="tel" className={fieldClass(!!errors.phone)} placeholder="08123456789" {...register('phone')} />
              {errors.phone && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="klabel text-nearblack/70 mb-1.5 block">Email</label>
              <input type="email" className={fieldClass(!!errors.email)} placeholder="email@bisnis.com" {...register('email')} />
              {errors.email && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="klabel text-nearblack/70 mb-1.5 block">Kategori</label>
                <select className={selectClass(!!errors.category)} {...register('category')}>
                  <option value="">Pilih</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.category.message}</p>}
              </div>
              <div>
                <label className="klabel text-nearblack/70 mb-1.5 block">Blok</label>
                <select className={selectClass(!!errors.block)} {...register('block')}>
                  <option value="">Pilih Blok</option>
                  {slots.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {errors.block && <p className="mt-1 font-accent text-sm text-coral font-semibold">{errors.block.message}</p>}
              </div>
            </div>

            <div className="pt-3">
              <button type="submit" className="w-full kbtn bg-[#25D366] text-white border-nearblack flex items-center justify-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5" />
                Daftarkan Tenant Saya
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
