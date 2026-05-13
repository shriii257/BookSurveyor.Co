import { DEMO_SURVEYORS, EXPERIENCE_RANGES, type Surveyor } from '@/types/surveyor';
import { getSupabasePublicClient } from './supabase';

export type SearchParams = {
  district?: string;
  equipment?: string[];
  experience?: string[];
  sort?: 'experience' | 'newest' | 'name';
  page?: number;
};

const pageSize = 10;

export function districtMatches(surveyor: Surveyor, district?: string) {
  if (!district) return true;
  const normalized = district.toLowerCase();
  return surveyor.districts_served.some((item) => item.toLowerCase() === normalized);
}

function filterDemo(params: SearchParams) {
  let data = DEMO_SURVEYORS.filter((surveyor) => surveyor.admin_approved && surveyor.available);

  data = data.filter((surveyor) => districtMatches(surveyor, params.district));

  if (params.equipment?.length) {
    data = data.filter((surveyor) =>
      surveyor.equipment.some((item) => params.equipment!.includes(item)),
    );
  }

  if (params.experience?.length) {
    data = data.filter((surveyor) =>
      params.experience!.some((rangeValue) => {
        const range = EXPERIENCE_RANGES.find((item) => item.value === rangeValue);
        return range
          ? surveyor.years_experience >= range.min && surveyor.years_experience <= range.max
          : false;
      }),
    );
  }

  if (params.sort === 'name') data.sort((a, b) => a.full_name.localeCompare(b.full_name));
  else if (params.sort === 'newest') data.sort((a, b) => b.created_at.localeCompare(a.created_at));
  else data.sort((a, b) => b.years_experience - a.years_experience);

  const page = params.page ?? 1;
  return {
    data: data.slice((page - 1) * pageSize, page * pageSize),
    count: data.length,
    source: 'demo' as const,
  };
}

export async function searchSurveyors(params: SearchParams) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return filterDemo(params);

  let query = supabase
    .from('surveyors')
    .select('*', { count: 'exact' })
    .eq('admin_approved', true)
    .eq('available', true)
    .eq('status', 'approved');

  if (params.district) {
    query = query.contains('districts_served', [params.district]);
  }

  if (params.equipment?.length) {
    query = query.overlaps('equipment', params.equipment);
  }

  if (params.experience?.length) {
    const ranges = params.experience
      .map((value) => EXPERIENCE_RANGES.find((item) => item.value === value))
      .filter(Boolean);
    if (ranges.length === 1 && ranges[0]) {
      query = query.gte('years_experience', ranges[0].min).lte('years_experience', ranges[0].max);
    }
  }

  if (params.sort === 'name') query = query.order('full_name', { ascending: true });
  else if (params.sort === 'newest') query = query.order('created_at', { ascending: false });
  else query = query.order('years_experience', { ascending: false });

  const page = params.page ?? 1;
  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  if (error) return filterDemo(params);

  return {
    data: (data ?? []) as Surveyor[],
    count: count ?? 0,
    source: 'supabase' as const,
  };
}

export async function getSurveyorById(id: string) {
  const supabase = getSupabasePublicClient();
  if (!supabase) return DEMO_SURVEYORS.find((surveyor) => surveyor.id === id) ?? null;

  const { data } = await supabase
    .from('surveyors')
    .select('*')
    .eq('id', id)
    .eq('admin_approved', true)
    .eq('available', true)
    .eq('status', 'approved')
    .single();

  return data as Surveyor | null;
}
