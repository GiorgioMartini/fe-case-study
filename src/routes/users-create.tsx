import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../hooks/useUsers';
import {
  userSchema,
  type UserFormData,
  getRoleOptions,
} from '../lib/validations';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/users-create')({
  component: UserCreatePage,
});

function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <FormItem>
          <FormLabel htmlFor="username">Name</FormLabel>
          <FormControl>
            <Input
              id="username"
              {...register('username')}
              placeholder="Enter user name"
              disabled={createUserMutation.isPending}
            />
          </FormControl>
          {errors.username && (
            <FormMessage>{errors.username.message}</FormMessage>
          )}
        </FormItem>

        {/* Role Field */}
        <FormItem>
          <FormLabel htmlFor="role">Role</FormLabel>
          <FormControl>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={createUserMutation.isPending}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRoleOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormControl>
          {errors.role && <FormMessage>{errors.role.message}</FormMessage>}
        </FormItem>

        {/* API Error Display */}
        {createUserMutation.isError && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
            {createUserMutation.error?.message || 'Failed to create user'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/users' })}
            disabled={createUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
