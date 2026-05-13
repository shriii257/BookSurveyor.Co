import { NextResponse } from 'next/server';
import { getSupabaseAdminClient, isValidPhone, normalizePhone, storagePath } from '@/lib/supabase';

const maxPhotoBytes = 2 * 1024 * 1024;
const maxDocBytes = 5 * 1024 * 1024;

function fileExt(file: File) {
  return file.name.split('.').pop() || 'upload';
}

async function uploadFile(bucket: string, prefix: string, file: File) {
  const supabase = getSupabaseAdminClient();
  if (!supabase || file.size === 0) return null;

  const path = storagePath(prefix, `file.${fileExt(file)}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw new Error(error.message);

  if (bucket === 'profile-photos') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  return path;
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase credentials are missing. Add them in .env.local or Vercel.' }, { status: 503 });
  }

  const formData = await request.formData();
  const fullName = String(formData.get('full_name') ?? '').trim();
  const phone = normalizePhone(String(formData.get('phone') ?? ''));
  const sameWhatsapp = formData.get('same_whatsapp') === 'yes';
  const whatsapp = sameWhatsapp ? phone : normalizePhone(String(formData.get('whatsapp') ?? ''));
  const licenseNumber = String(formData.get('license_number') ?? '').trim();
  const yearsExperience = Number(formData.get('years_experience') ?? 0);
  const equipment = formData.getAll('equipment').map(String);
  const districtsServed = formData.getAll('districts_served').map(String).slice(0, 5);
  const bio = String(formData.get('bio') ?? '').trim();
  const profilePhoto = formData.get('profile_photo') as File | null;
  const licenseDoc = formData.get('license_doc') as File | null;

  if (!fullName || !isValidPhone(phone) || !isValidPhone(whatsapp) || !licenseNumber || !yearsExperience) {
    return NextResponse.json({ error: 'Please fill all required fields with valid values.' }, { status: 400 });
  }
  if (equipment.length === 0 || districtsServed.length === 0) {
    return NextResponse.json({ error: 'Select at least one equipment item and one district.' }, { status: 400 });
  }
  if (districtsServed.length > 5) {
    return NextResponse.json({ error: 'You can select up to 5 districts.' }, { status: 400 });
  }
  if (!licenseDoc || licenseDoc.size === 0) {
    return NextResponse.json({ error: 'License document is required.' }, { status: 400 });
  }
  if (profilePhoto && profilePhoto.size > maxPhotoBytes) {
    return NextResponse.json({ error: 'Profile photo must be 2MB or less.' }, { status: 400 });
  }
  if (licenseDoc.size > maxDocBytes) {
    return NextResponse.json({ error: 'License document must be 5MB or less.' }, { status: 400 });
  }

  try {
    const profilePhotoUrl = profilePhoto && profilePhoto.size > 0 ? await uploadFile('profile-photos', phone, profilePhoto) : null;
    const licenseDocUrl = await uploadFile('license-docs', phone, licenseDoc);

    const { data, error } = await supabase
      .from('surveyors')
      .insert({
        full_name: fullName,
        phone,
        whatsapp,
        profile_photo_url: profilePhotoUrl,
        license_number: licenseNumber,
        years_experience: yearsExperience,
        equipment,
        districts_served: districtsServed,
        bio: bio || null,
        license_doc_url: licenseDocUrl,
        admin_approved: false,
        available: true,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const adminPhone = process.env.ADMIN_WHATSAPP;
    const adminWhatsappUrl = adminPhone
      ? `https://wa.me/${adminPhone}?text=${encodeURIComponent(
          `New BookSurveyor registration: ${fullName}, phone ${phone}, license ${licenseNumber}`,
        )}`
      : null;

    return NextResponse.json({ surveyor: data, adminWhatsappUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Registration failed.' }, { status: 500 });
  }
}
