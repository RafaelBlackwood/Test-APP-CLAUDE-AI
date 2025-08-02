import { z } from 'zod';
import { UserRole, EducationLevel } from '../types';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters long')
  .max(50, 'Must be less than 50 characters long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes are allowed');

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
  .optional();

export const gpaSchema = z
  .number()
  .min(0.0, 'GPA must be at least 0.0')
  .max(4.0, 'GPA cannot exceed 4.0')
  .optional();

export const graduationYearSchema = z
  .number()
  .min(1900, 'Please enter a valid year')
  .max(new Date().getFullYear() + 10, 'Year cannot be more than 10 years in the future')
  .optional();

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: nameSchema,
    lastName: nameSchema,
    role: z.nativeEnum(UserRole, {
      required_error: 'Please select a role',
    }),
    acceptTerms: z.boolean().refine(value => value === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Invalid reset token'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const twoFactorVerificationSchema = z.object({
  code: z
    .string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
});

export const twoFactorBackupCodeSchema = z.object({
  backupCode: z
    .string()
    .min(8, 'Backup code must be at least 8 characters')
    .max(16, 'Backup code must be less than 16 characters'),
});

// Profile schemas
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const emergencyContactSchema = z.object({
  name: nameSchema,
  relationship: z.string().min(1, 'Relationship is required'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  email: emailSchema.optional(),
});

export const academicInfoSchema = z.object({
  currentGPA: gpaSchema,
  graduationYear: graduationYearSchema,
  intendedMajor: z.string().optional(),
  currentLevel: z.nativeEnum(EducationLevel, {
    required_error: 'Please select your current education level',
  }),
});

export const educationRecordSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  major: z.string().min(1, 'Major is required'),
  gpa: gpaSchema,
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  completed: z.boolean(),
});

export const userProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  phoneNumber: phoneSchema,
  address: addressSchema.optional(),
  nationality: z.string().optional(),
  emergencyContact: emergencyContactSchema.optional(),
  academicInfo: academicInfoSchema.optional(),
});

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  avatar: z.string().url().optional(),
  profile: userProfileSchema.optional(),
});

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// File upload schema
export const fileUploadSchema = z.object({
  file: z
    .any()
    .refine(file => file instanceof File, 'Please select a file')
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'File type not supported'
    ),
});

// Search and filter schemas
export const universitySearchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  tuition: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  programs: z.array(z.string()).optional(),
  degreeTypes: z.array(z.string()).optional(),
  campusTypes: z.array(z.string()).optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Export types for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type TwoFactorVerificationFormData = z.infer<typeof twoFactorVerificationSchema>;
export type TwoFactorBackupCodeFormData = z.infer<typeof twoFactorBackupCodeSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type UniversitySearchFormData = z.infer<typeof universitySearchSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Custom validation functions
export const validatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Include special characters (@$!%*?&)');

  // Common pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 1;
  else feedback.push('Avoid repeating characters');

  if (!/123|abc|qwe/i.test(password)) score += 1;
  else feedback.push('Avoid common sequences');

  return { score, feedback };
};

export const validateEmailDomain = (email: string): boolean => {
  const allowedDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'edu', 'ac.uk', 'edu.au', 'edu.ca'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return allowedDomains.some(allowed => 
    domain === allowed || domain.endsWith('.' + allowed)
  );
};