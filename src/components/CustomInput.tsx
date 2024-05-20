import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { HTMLInputTypeAttribute } from 'react';

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  type?: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
};

export function CustomInput<T extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
}: CustomInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FormLabel className="text-sm w-full max-w-[280px] font-medium text-gray-700">
            {label}
          </FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                className="text-base placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-12 text-red-500 mt-2" />
          </div>
        </div>
      )}
    />
  );
}
