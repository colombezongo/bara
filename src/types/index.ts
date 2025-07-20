// Types pour les emplois formels
export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior';
  postedDate: Date;
  matchPercentage?: number;
  logo?: string;
}

// Types pour les emplois informels
export interface InformalJob {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  employer: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
  };
  postedDate: Date;
  category: 'menage' | 'cuisine' | 'transport' | 'jardinage' | 'autre';
  language: 'francais' | 'bambara' | 'dioula' | 'autre';
}

// Types pour le CV
export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
}

export interface Language {
  name: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'natif';
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  description?: string;
}

// Types pour l'entretien
export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technique' | 'comportemental' | 'culture' | 'situation';
  difficulty: 'facile' | 'moyen' | 'difficile';
  tips?: string[];
}

export interface InterviewSession {
  id: string;
  jobTitle: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  feedback: InterviewFeedback;
  date: Date;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  audioUrl?: string;
  duration?: number;
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  toneAnalysis: {
    confidence: number;
    clarity: number;
    enthusiasm: number;
  };
}

// Types pour les filtres
export interface JobFilters {
  location?: string;
  type?: string[];
  experience?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  keywords?: string;
}

export interface InformalJobFilters {
  location?: string;
  category?: string[];
  language?: string[];
  maxSalary?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  sector: 'formal' | 'informal';
  postedDate: Date;
  deadline?: Date;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  languages?: string[];
  remote?: boolean;
  urgent?: boolean;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  profile?: {
    bio?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    languages?: string[];
    certifications?: string[];
    portfolio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  preferences: {
    language: 'francais' | 'bambara' | 'dioula' | 'anglais';
    notifications: boolean;
    location: string;
    jobTypes?: string[];
    salary?: {
      min: number;
      max: number;
    };
    remote?: boolean;
  };
  cv?: CVData;
  savedJobs: string[];
  appliedJobs: string[];
  interviewHistory: InterviewSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedDate: Date;
  coverLetter?: string;
  resume?: string;
  notes?: string;
}

export interface JobPosting {
  id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  sector: 'formal' | 'informal';
  postedDate: Date;
  deadline?: Date;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  languages?: string[];
  remote?: boolean;
  urgent?: boolean;
  featured?: boolean;
  status: 'active' | 'paused' | 'closed';
  applications?: JobApplication[];
}

export interface Employer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large';
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  keywords?: string;
  location?: string;
  jobType?: string[];
  sector?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  experience?: string;
  remote?: boolean;
  urgent?: boolean;
  featured?: boolean;
  postedWithin?: number; // days
}

export interface SearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job_match' | 'application_update' | 'new_job' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedDate: Date;
  notes?: string;
}

export interface JobRecommendation {
  job: Job;
  score: number;
  reasons: string[];
}

export interface Analytics {
  totalJobs: number;
  totalApplications: number;
  totalUsers: number;
  totalEmployers: number;
  popularSkills: string[];
  popularLocations: string[];
  averageSalary: number;
  jobTypesDistribution: Record<string, number>;
  sectorsDistribution: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchParams extends SearchFilters, PaginationParams {}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  languages?: string[];
  certifications?: string[];
  portfolio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  preferences?: {
    jobTypes?: string[];
    locations?: string[];
    salary?: {
      min?: number;
      max?: number;
    };
    remote?: boolean;
    notifications?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplicationForm {
  jobId: string;
  coverLetter?: string;
  resume?: File;
  additionalInfo?: string;
}

export interface JobPostingForm {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  sector: 'formal' | 'informal';
  deadline?: Date;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  languages?: string[];
  remote?: boolean;
  urgent?: boolean;
  featured?: boolean;
}

export interface EmployerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large';
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobMatch {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  createdAt: Date;
  lastSent?: Date;
}

export interface JobStatistics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  averageSalary: number;
  topSkills: string[];
  topLocations: string[];
  jobTypeDistribution: Record<string, number>;
  sectorDistribution: Record<string, number>;
  salaryRangeDistribution: Record<string, number>;
}

export interface UserDashboard {
  profile: UserProfile;
  recentApplications: JobApplication[];
  savedJobs: SavedJob[];
  jobMatches: JobMatch[];
  jobAlerts: JobAlert[];
  statistics: {
    applicationsSubmitted: number;
    interviewsScheduled: number;
    jobsSaved: number;
    profileViews: number;
  };
}

export interface EmployerDashboard {
  profile: EmployerProfile;
  activeJobPostings: JobPosting[];
  recentApplications: JobApplication[];
  statistics: {
    totalJobPostings: number;
    activeJobPostings: number;
    totalApplications: number;
    applicationsThisMonth: number;
    averageApplicationRate: number;
  };
}

export interface AdminDashboard {
  totalUsers: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  recentActivity: {
    newUsers: User[];
    newJobPostings: JobPosting[];
    newApplications: JobApplication[];
  };
  analytics: Analytics;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  children?: JobCategory[];
  jobCount?: number;
}

export interface JobSkill {
  id: string;
  name: string;
  category?: string;
  demandScore?: number;
  averageSalary?: number;
  relatedSkills?: string[];
}

export interface JobLocation {
  id: string;
  name: string;
  country: string;
  region?: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  jobCount?: number;
  averageSalary?: number;
}

export interface JobSalary {
  minSalary?: number;
  maxSalary?: number;
}

// Types pour la reconnaissance vocale
export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceRecognitionCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onResult?: (result: VoiceRecognitionResult) => void;
  onSilenceDetected?: () => void;
}

export interface VoiceRecognitionConfig {
  language: string;
  silenceTimeout: number;
  continuous: boolean;
  interimResults: boolean;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
  nativeCode: string;
}

export interface VoiceRecognitionState {
  isListening: boolean;
  currentText: string;
  isProcessing: boolean;
  currentLanguage: string;
  silenceTimer: NodeJS.Timeout | null;
} 