// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  STUDENT = 'student',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
}

export interface UserProfile {
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: Address;
  nationality?: string;
  emergencyContact?: EmergencyContact;
  academicInfo?: AcademicInfo;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface AcademicInfo {
  currentGPA?: number;
  graduationYear?: number;
  intendedMajor?: string;
  currentLevel: EducationLevel;
  previousEducation?: EducationRecord[];
}

export enum EducationLevel {
  HIGH_SCHOOL = 'high_school',
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
}

export interface EducationRecord {
  institution: string;
  degree: string;
  major: string;
  gpa?: number;
  startDate: string;
  endDate: string;
  completed: boolean;
}

// University Types
export interface University {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  website: string;
  logo?: string;
  images?: string[];
  location: UniversityLocation;
  rankings?: UniversityRanking[];
  programs: Program[];
  admissionRequirements: AdmissionRequirements;
  tuition: TuitionInfo;
  demographics?: UniversityDemographics;
  facilities?: string[];
  accreditation?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UniversityLocation {
  address: Address;
  campus: CampusType;
  timezone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum CampusType {
  URBAN = 'urban',
  SUBURBAN = 'suburban',
  RURAL = 'rural',
  ONLINE = 'online',
}

export interface UniversityRanking {
  source: string;
  rank: number;
  category?: string;
  year: number;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  degree: DegreeType;
  major: string;
  duration: number; // in semesters
  credits: number;
  tuition: number;
  admissionRequirements?: AdmissionRequirements;
  curriculum?: string[];
  specializations?: string[];
  isActive: boolean;
}

export enum DegreeType {
  ASSOCIATES = 'associates',
  BACHELORS = 'bachelors',
  MASTERS = 'masters',
  DOCTORATE = 'doctorate',
  CERTIFICATE = 'certificate',
}

export interface AdmissionRequirements {
  minimumGPA?: number;
  standardizedTests?: StandardizedTest[];
  languageRequirements?: LanguageRequirement[];
  essays?: EssayRequirement[];
  recommendations?: number;
  portfolio?: boolean;
  interview?: boolean;
  deadlines?: AdmissionDeadline[];
}

export interface StandardizedTest {
  type: TestType;
  minimumScore?: number;
  required: boolean;
}

export enum TestType {
  SAT = 'SAT',
  ACT = 'ACT',
  GRE = 'GRE',
  GMAT = 'GMAT',
  TOEFL = 'TOEFL',
  IELTS = 'IELTS',
}

export interface LanguageRequirement {
  language: string;
  proficiencyLevel: string;
  tests?: StandardizedTest[];
}

export interface EssayRequirement {
  topic: string;
  wordLimit: number;
  required: boolean;
}

export interface AdmissionDeadline {
  type: DeadlineType;
  date: string;
  description?: string;
}

export enum DeadlineType {
  EARLY_DECISION = 'early_decision',
  EARLY_ACTION = 'early_action',
  REGULAR_DECISION = 'regular_decision',
  ROLLING = 'rolling',
}

export interface TuitionInfo {
  inState?: number;
  outOfState?: number;
  international?: number;
  roomAndBoard?: number;
  fees?: TuitionFee[];
  financialAid?: FinancialAidInfo;
}

export interface TuitionFee {
  name: string;
  amount: number;
  required: boolean;
}

export interface FinancialAidInfo {
  averageAid?: number;
  aidPercentage?: number;
  scholarships?: ScholarshipInfo[];
}

export interface ScholarshipInfo {
  name: string;
  amount: number;
  criteria: string;
  renewable: boolean;
}

export interface UniversityDemographics {
  totalStudents: number;
  undergraduateStudents: number;
  graduateStudents: number;
  internationalStudents: number;
  studentToFacultyRatio: number;
  diversityStats?: Record<string, number>;
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  universityId: string;
  programId: string;
  status: ApplicationStatus;
  submittedAt?: string;
  deadlineDate: string;
  documents: ApplicationDocument[];
  essays: ApplicationEssay[];
  testScores: TestScore[];
  recommendations: Recommendation[];
  timeline: ApplicationTimelineEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WAITLISTED = 'waitlisted',
  DEFERRED = 'deferred',
  WITHDRAWN = 'withdrawn',
}

export interface ApplicationDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export enum DocumentType {
  TRANSCRIPT = 'transcript',
  RECOMMENDATION_LETTER = 'recommendation_letter',
  PERSONAL_STATEMENT = 'personal_statement',
  RESUME = 'resume',
  PORTFOLIO = 'portfolio',
  FINANCIAL_STATEMENT = 'financial_statement',
  PASSPORT = 'passport',
  DIPLOMA = 'diploma',
  OTHER = 'other',
}

export interface ApplicationEssay {
  id: string;
  topic: string;
  content: string;
  wordCount: number;
  wordLimit: number;
  lastSaved: string;
}

export interface TestScore {
  id: string;
  testType: TestType;
  score: number;
  testDate: string;
  reportSent: boolean;
}

export interface Recommendation {
  id: string;
  recommenderName: string;
  recommenderEmail: string;
  recommenderTitle: string;
  relationship: string;
  status: RecommendationStatus;
  requestedAt: string;
  submittedAt?: string;
}

export enum RecommendationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  RECEIVED = 'received',
  SUBMITTED = 'submitted',
}

export interface ApplicationTimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}

export enum TimelineEventType {
  APPLICATION_STARTED = 'application_started',
  DOCUMENT_UPLOADED = 'document_uploaded',
  ESSAY_COMPLETED = 'essay_completed',
  RECOMMENDATION_REQUESTED = 'recommendation_requested',
  RECOMMENDATION_RECEIVED = 'recommendation_received',
  APPLICATION_SUBMITTED = 'application_submitted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  DECISION_RECEIVED = 'decision_received',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface UniversitySearchFilters {
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  tuition?: {
    min?: number;
    max?: number;
  };
  programs?: string[];
  degreeTypes?: DegreeType[];
  campusTypes?: CampusType[];
  ranking?: {
    source?: string;
    maxRank?: number;
  };
  size?: {
    minStudents?: number;
    maxStudents?: number;
  };
  admissionRate?: {
    min?: number;
    max?: number;
  };
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  facets?: Record<string, Array<{ value: string; count: number }>>;
}

// Form Types
export interface FormErrors {
  [key: string]: string | string[] | FormErrors;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export enum NotificationType {
  APPLICATION_UPDATE = 'application_update',
  DEADLINE_REMINDER = 'deadline_reminder',
  RECOMMENDATION_REQUEST = 'recommendation_request',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  DOCUMENT_VERIFIED = 'document_verified',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
}

// Dashboard Types
export interface DashboardStats {
  totalApplications: number;
  submittedApplications: number;
  acceptedApplications: number;
  pendingDeadlines: number;
  upcomingInterviews: number;
}

export interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export enum ActivityType {
  APPLICATION_CREATED = 'application_created',
  APPLICATION_SUBMITTED = 'application_submitted',
  DOCUMENT_UPLOADED = 'document_uploaded',
  UNIVERSITY_SAVED = 'university_saved',
  PROFILE_UPDATED = 'profile_updated',
}

// Common Utility Types
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: string;
  order: SortOrder;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  roles?: UserRole[];
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profile?: Partial<UserProfile>;
  acceptTerms: boolean;
}

export interface SocialAuthProvider {
  id: 'google' | 'facebook' | 'apple';
  name: string;
  icon: string;
  color: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  code: string;
  backupCode?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
}

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  
  // Social Auth
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  
  // Two Factor Auth
  setupTwoFactor: () => Promise<TwoFactorSetup>;
  verifyTwoFactor: (verification: TwoFactorVerification) => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  
  // Password Reset
  forgotPassword: (request: PasswordResetRequest) => Promise<void>;
  resetPassword: (reset: PasswordReset) => Promise<void>;
  
  // Email Verification
  verifyEmail: (verification: EmailVerification) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

// Form Validation Types
export interface FormFieldError {
  message: string;
  type: string;
}

export interface AuthFormErrors {
  email?: FormFieldError;
  password?: FormFieldError;
  confirmPassword?: FormFieldError;
  firstName?: FormFieldError;
  lastName?: FormFieldError;
  acceptTerms?: FormFieldError;
  code?: FormFieldError;
  [key: string]: FormFieldError | undefined;
}