// Application Constants
export const APP_NAME = 'University Application Platform';
export const APP_DESCRIPTION = 'Your comprehensive platform for university applications and admissions';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SAVED_SEARCHES: 'saved_searches',
  DRAFT_APPLICATIONS: 'draft_applications',
} as const;

// Session Storage Keys
export const SESSION_STORAGE_KEYS = {
  SEARCH_FILTERS: 'search_filters',
  CURRENT_PAGE: 'current_page',
  FORM_DATA: 'form_data',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  UNIVERSITIES: '/universities',
  UNIVERSITY_DETAIL: '/universities/:id',
  PROGRAMS: '/programs',
  PROGRAM_DETAIL: '/programs/:id',
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: '/applications/:id',
  APPLICATION_CREATE: '/applications/create',
  DOCUMENTS: '/documents',
  ESSAYS: '/essays',
  RECOMMENDATIONS: '/recommendations',
  DEADLINES: '/deadlines',
  SCHOLARSHIPS: '/scholarships',
  HELP: '/help',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_UNIVERSITIES: '/admin/universities',
  ADMIN_APPLICATIONS: '/admin/applications',
} as const;

// Application Status Colors
export const APPLICATION_STATUS_COLORS = {
  draft: 'gray',
  in_progress: 'blue',
  submitted: 'yellow',
  under_review: 'orange',
  interview_scheduled: 'purple',
  accepted: 'green',
  rejected: 'red',
  waitlisted: 'amber',
  deferred: 'indigo',
  withdrawn: 'gray',
} as const;

// Application Status Labels
export const APPLICATION_STATUS_LABELS = {
  draft: 'Draft',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
  deferred: 'Deferred',
  withdrawn: 'Withdrawn',
} as const;

// Degree Type Labels
export const DEGREE_TYPE_LABELS = {
  associates: "Associate's Degree",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  doctorate: 'Doctorate',
  certificate: 'Certificate',
} as const;

// Test Type Labels
export const TEST_TYPE_LABELS = {
  SAT: 'SAT',
  ACT: 'ACT',
  GRE: 'GRE',
  GMAT: 'GMAT',
  TOEFL: 'TOEFL',
  IELTS: 'IELTS',
} as const;

// Document Type Labels
export const DOCUMENT_TYPE_LABELS = {
  transcript: 'Official Transcript',
  recommendation_letter: 'Letter of Recommendation',
  personal_statement: 'Personal Statement',
  resume: 'Resume/CV',
  portfolio: 'Portfolio',
  financial_statement: 'Financial Statement',
  passport: 'Passport',
  diploma: 'Diploma/Certificate',
  other: 'Other Document',
} as const;

// Campus Type Labels
export const CAMPUS_TYPE_LABELS = {
  urban: 'Urban',
  suburban: 'Suburban',
  rural: 'Rural',
  online: 'Online',
} as const;

// Education Level Labels
export const EDUCATION_LEVEL_LABELS = {
  high_school: 'High School',
  undergraduate: 'Undergraduate',
  graduate: 'Graduate',
  postgraduate: 'Postgraduate',
} as const;

// User Role Labels
export const USER_ROLE_LABELS = {
  student: 'Student',
  counselor: 'Counselor',
  admin: 'Administrator',
} as const;

// Deadline Type Labels
export const DEADLINE_TYPE_LABELS = {
  early_decision: 'Early Decision',
  early_action: 'Early Action',
  regular_decision: 'Regular Decision',
  rolling: 'Rolling Admission',
} as const;

// Recommendation Status Labels
export const RECOMMENDATION_STATUS_LABELS = {
  pending: 'Pending',
  sent: 'Request Sent',
  received: 'Response Received',
  submitted: 'Submitted',
} as const;

// Notification Type Labels
export const NOTIFICATION_TYPE_LABELS = {
  application_update: 'Application Update',
  deadline_reminder: 'Deadline Reminder',
  recommendation_request: 'Recommendation Request',
  system_announcement: 'System Announcement',
  document_verified: 'Document Verified',
  interview_scheduled: 'Interview Scheduled',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  },
  PHONE: {
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  GPA: {
    min: 0.0,
    max: 4.0,
    step: 0.01,
    message: 'GPA must be between 0.0 and 4.0',
  },
  GRADUATION_YEAR: {
    min: 1900,
    max: new Date().getFullYear() + 10,
    message: 'Please enter a valid graduation year',
  },
} as const;

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    documents: ['pdf', 'doc', 'docx'],
    images: ['jpg', 'jpeg', 'png', 'gif'],
    transcripts: ['pdf'],
  },
  MESSAGES: {
    SIZE_ERROR: 'File size must be less than 10MB',
    TYPE_ERROR: 'Invalid file type',
    UPLOAD_SUCCESS: 'File uploaded successfully',
    UPLOAD_ERROR: 'Failed to upload file',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Search and Filtering
export const SEARCH = {
  DEBOUNCE_DELAY: 300,
  MIN_QUERY_LENGTH: 2,
  MAX_RECENT_SEARCHES: 10,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  DISPLAY_SHORT: 'MM/dd/yy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const;

// Currency
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US',
} as const;

// Theme Configuration
export const THEME = {
  STORAGE_KEY: 'theme',
  DEFAULT: 'light',
  OPTIONS: ['light', 'dark', 'system'],
} as const;

// Toast Configuration
export const TOAST = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 7000,
  },
  POSITION: 'top-right',
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 1100,
  NOTIFICATION: 1200,
  TOOLTIP: 1300,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE: 'Changes saved successfully',
  DELETE: 'Item deleted successfully',
  CREATE: 'Item created successfully',
  UPDATE: 'Item updated successfully',
  UPLOAD: 'File uploaded successfully',
  SUBMIT: 'Submitted successfully',
} as const;

// External Links
export const EXTERNAL_LINKS = {
  COLLEGE_BOARD: 'https://www.collegeboard.org',
  COMMON_APP: 'https://www.commonapp.org',
  FAFSA: 'https://studentaid.gov/h/apply-for-aid/fafsa',
  SAT: 'https://collegereadiness.collegeboard.org/sat',
  ACT: 'https://www.act.org',
  TOEFL: 'https://www.ets.org/toefl',
  IELTS: 'https://www.ielts.org',
} as const;

// Social Media
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com',
  YOUTUBE: 'https://youtube.com',
} as const;