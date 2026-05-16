export interface Surveyor {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  profile_photo_url: string | null;
  license_number: string | null;
  gst_number: string | null;
  years_experience: number;
  equipment: string[];
  districts_served: string[];
  bio: string | null;
  license_doc_url: string | null;
  gst_doc_url: string | null;
  admin_approved: boolean;
  available: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export type SurveyorStatus = Surveyor['status'];

export interface SurveyorInput {
  full_name: string;
  phone: string;
  whatsapp: string;
  profile_photo_url?: string | null;
  license_number?: string | null;
  gst_number?: string | null;
  years_experience: number;
  equipment: string[];
  districts_served: string[];
  bio?: string | null;
  license_doc_url?: string | null;
  gst_doc_url?: string | null;
}

export interface SearchFilters {
  district: string;
  equipment: string[];
  experienceRanges: string[];
  sort: 'experience' | 'newest' | 'name';
  page: number;
}

export const EQUIPMENT_OPTIONS = [
  'Total Station',
  'GPS/GNSS',
  'Drone',
  'Theodolite',
  'Auto Level',
  'Plane Table',
  'Chain Survey Equipment',
] as const;

export const EXPERIENCE_RANGES = [
  { label: '0–5 years', value: '0-5', min: 0, max: 5 },
  { label: '5–15 years', value: '5-15', min: 5, max: 15 },
  { label: '15+ years', value: '15+', min: 15, max: 99 },
] as const;

export const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
] as const;

export const ALL_DISTRICTS = [
  ...MAHARASHTRA_DISTRICTS,
  // Other major Indian districts
  'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru',
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli',
  'Hyderabad', 'Warangal', 'Visakhapatnam', 'Vijayawada',
  'Delhi', 'New Delhi', 'Gurugram', 'Faridabad', 'Noida',
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad',
  'Patna', 'Gaya', 'Bhagalpur',
  'Kolkata', 'Howrah', 'Durgapur',
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur',
  'Bhubaneswar', 'Cuttack', 'Rourkela',
  'Guwahati', 'Silchar',
  'Chandigarh', 'Amritsar', 'Ludhiana',
  'Dehradun', 'Haridwar',
  'Ranchi', 'Jamshedpur',
  'Thiruvananthapuram', 'Kochi', 'Kozhikode',
].sort();

export const DEMO_SURVEYORS: Surveyor[] = [
  {
    id: 'demo-1',
    created_at: '2026-01-12T00:00:00.000Z',
    full_name: 'Amit Patil',
    phone: '919820000101',
    whatsapp: '919820000101',
    profile_photo_url: null,
    license_number: 'MH-2847',
    gst_number: null,
    years_experience: 12,
    equipment: ['Total Station', 'GPS/GNSS', 'Drone'],
    districts_served: ['Pune', 'Nashik', 'Satara'],
    bio: 'Licensed land surveyor for farm boundaries, layouts, and construction marking.',
    license_doc_url: null,
    gst_doc_url: null,
    admin_approved: true,
    available: true,
    status: 'approved',
  },
  {
    id: 'demo-2',
    created_at: '2026-02-04T00:00:00.000Z',
    full_name: 'Neha Kulkarni',
    phone: '919820000202',
    whatsapp: '919820000202',
    profile_photo_url: null,
    license_number: 'MH-3011',
    gst_number: null,
    years_experience: 8,
    equipment: ['Total Station', 'Auto Level', 'Theodolite'],
    districts_served: ['Mumbai', 'Thane', 'Raigad'],
    bio: 'Urban plot survey, elevation work, and municipal documentation support.',
    license_doc_url: null,
    gst_doc_url: null,
    admin_approved: true,
    available: true,
    status: 'approved',
  },
  {
    id: 'demo-3',
    created_at: '2026-03-18T00:00:00.000Z',
    full_name: 'Rahul Deshmukh',
    phone: '919820000303',
    whatsapp: '919820000303',
    profile_photo_url: null,
    license_number: 'MH-3320',
    gst_number: null,
    years_experience: 16,
    equipment: ['GPS/GNSS', 'Drone', 'Plane Table'],
    districts_served: ['Nagpur', 'Chhatrapati Sambhajinagar', 'Amravati'],
    bio: 'Large agricultural parcels, road alignments, and village map surveys.',
    license_doc_url: null,
    gst_doc_url: null,
    admin_approved: true,
    available: true,
    status: 'approved',
  },
];
