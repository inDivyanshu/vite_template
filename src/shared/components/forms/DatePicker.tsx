import React, { forwardRef, InputHTMLAttributes } from 'react';
import { useForm } from './FormContext';

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  name: string;
  label?: string;
  helperText?: string;
  onChange?: (value: string, name: string) => void;
  error?: string;
  fullWidth?: boolean;
  showErrorMessage?: boolean;
  minDate?: string;
  maxDate?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      name,
      label,
      helperText,
      onChange,
      error: propError,
      fullWidth = false,
      showErrorMessage = true,
      className = '',
      required,
      disabled,
      minDate,
      maxDate,
      ...rest
    },
    ref
  ) => {
    const form = useForm();

    // Determine whether to use form context or props
    const isControlled = onChange !== undefined;

    // Get values from form context if not controlled
    const value = isControlled ? (rest.value as string) : form.values[name] || '';
    const error = isControlled ? propError : form.errors[name];
    const touched = isControlled ? true : form.touched[name];

    // Handle change event
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (isControlled) {
        onChange?.(newValue, name);
      } else {
        form.setValue(name, newValue);
      }
    };

    // Handle blur event to mark field as touched
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isControlled) {
        form.setTouched(name, true);
      }

      rest.onBlur?.(e);
    };

    // Determine error state
    const hasError = Boolean(touched && error);

    // Base classes
    const inputClasses = `block w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
      hasError
        ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`;

    // Container classes
    const containerClasses = `${fullWidth ? 'w-full' : ''} ${rest.hidden ? 'hidden' : ''}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type="date"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          min={minDate}
          max={maxDate}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper-text` : undefined
          }
          {...rest}
        />

        {/* Helper text */}
        {helperText && !hasError && (
          <p id={`${name}-helper-text`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {/* Error message */}
        {showErrorMessage && hasError && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
