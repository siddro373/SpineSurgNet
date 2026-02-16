export interface SurgeonWithConferences {
  id: string;
  firstName: string;
  lastName: string;
  npiNumber: string;
  profileImageUrl: string | null;
  specialty: string;
  subSpecialty: string | null;
  boardCertified: boolean;
  fellowshipTrained: boolean;
  yearsInPractice: number | null;
  practiceName: string | null;
  hospitalAffiliation: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  phone: string | null;
  createdAt: string;
  conferences: {
    id: string;
    role: string | null;
    year: number | null;
    conference: {
      id: string;
      name: string;
      fullName: string;
    };
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStats {
  totalSurgeons: number;
  newThisWeek: number;
  newThisMonth: number;
  bySpecialty: { specialty: string; count: number }[];
  byState: { state: string; count: number }[];
  byConference: { name: string; count: number }[];
}
