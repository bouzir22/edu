import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { toast } from 'react-hot-toast';


type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = z.object({
    firstName: z.string().min(2, t('auth.validation.firstNameMinLength')),
    lastName: z.string().min(2, t('auth.validation.lastNameMinLength')),
    email: z.string().email(t('auth.validation.emailInvalid')),
    password: z.string().min(6, t('auth.validation.passwordMinLength')),
    confirmPassword: z.string(),
    role: z.enum(['student', 'instructor']),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.passwordsNotMatch'),
    path: ['confirmPassword'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName, data.role);
      toast.success(t('auth.registrationSuccessful'));
    } catch (error) {
      toast.error(t('auth.registrationFailed'));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('auth.createAccount')}</h2>
        <p className="text-gray-600 mt-2">{t('auth.joinPlatform')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('auth.firstName')}
            placeholder={t('auth.firstName')}
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label={t('auth.lastName')}
            placeholder={t('auth.lastName')}
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label={t('auth.email')}
          type="email"
          placeholder={t('auth.email')}
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('auth.role')}</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="student"
                {...register('role')}
                className="mr-2"
              />
              <span className="text-sm">{t('auth.student')}</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="instructor"
                {...register('role')}
                className="mr-2"
              />
              <span className="text-sm">{t('auth.instructor')}</span>
            </label>
          </div>
        </div>

        <Input
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth.password')}
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label={t('auth.confirmPassword')}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth.confirmPassword')}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="showPassword" className="ml-2 text-sm text-gray-600">
            {t('auth.showPassword')}
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          {t('auth.signUp')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {t('auth.alreadyHaveAccount')}
          </button>
        </div>
      </form>
    </Card>
  );
};