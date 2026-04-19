import { z } from 'zod';

export const categories = ['Makanan', 'Minuman', 'Dessert', 'Kriya / Kerajinan'] as const;
export const blocks = ['A', 'B', 'C', 'D'] as const;

export const registrationSchema = z.object({
  businessName: z
    .string()
    .min(3, 'Nama usaha minimal 3 karakter')
    .max(100, 'Nama usaha maksimal 100 karakter'),
  contactName: z
    .string()
    .min(3, 'Nama penanggung jawab minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .regex(
      /^(\+62|62|08)\d{8,13}$/,
      'Format nomor tidak valid (contoh: 0812-3456-7890)'
    ),
  email: z
    .string()
    .email('Format email tidak valid'),
  category: z
    .string()
    .min(1, 'Pilih kategori'),
  block: z
    .string()
    .min(1, 'Pilih blok'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
