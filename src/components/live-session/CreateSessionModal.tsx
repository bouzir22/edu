import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const createSessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  courseId: z.string().min(1, 'Course is required'),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type CreateSessionFormData = z.infer<typeof createSessionSchema>;

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  courseId 
}) => {
  const { createSession, isLoading } = useLiveSessionStore();
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      courseId: courseId || '',
      startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1 hour from now
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16), // 2 hours from now
    },
  });

  const onSubmit = async (data: CreateSessionFormData) => {
    try {
      await createSession({
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      });
      
      toast.success(t('liveSessions.sessionCreated'));
      reset();
      onClose();
    } catch (error) {
      toast.error(t('liveSessions.sessionCreateFailed'));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('liveSessions.createSession')}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('liveSessions.sessionTitle')}
            placeholder={t('liveSessions.sessionTitle')}
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t('liveSessions.description')}
            </label>
            <textarea
              {...register('description')}
              placeholder={t('liveSessions.description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>

          {!courseId && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {t('liveSessions.course')}
              </label>
              <select
                {...register('courseId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('liveSessions.selectCourse')}</option>
                <option value="1">الرياضيات المتقدمة</option>
                <option value="2">أساسيات علوم الحاسوب</option>
                <option value="3">مختبر الفيزياء</option>
              </select>
              {errors.courseId && (
                <p className="text-sm text-red-600">{errors.courseId.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('liveSessions.startTime')}
              type="datetime-local"
              {...register('startTime')}
              error={errors.startTime?.message}
            />

            <Input
              label={t('liveSessions.endTime')}
              type="datetime-local"
              {...register('endTime')}
              error={errors.endTime?.message}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              {t('liveSessions.createSession')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};