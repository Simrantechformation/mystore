// schemas/signupSchema.ts
import * as yup from 'yup';

export const signupSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  name: yup.string().required('Name is required'),
  avatar: yup.string().url().optional(),
  phone: yup.string().matches(/^\d{10}$/, 'Invalid phone number').optional(),
  language: yup.string().required('Language is required'),
  currency: yup.string().required('Currency is required'),
  theme: yup.string().oneOf(['light', 'dark']).required('Theme is required'),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;
