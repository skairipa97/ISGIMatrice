import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  type = 'text',
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  error,
  hint,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  hintClassName = '',
  required = false,
  ...rest
}, ref) => {
  const inputId = id || name;
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`relative rounded-md ${icon ? 'flex items-center' : ''}`}>
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`
            block w-full rounded-md border
            ${error ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'}
            ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400' : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}
            ${readOnly ? 'bg-gray-50 dark:bg-gray-800' : ''}
            ${icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
            ${icon && iconPosition === 'right' ? 'pr-10' : 'pr-3'}
            py-2 shadow-sm
            text-sm
            transition-colors duration-200
            ${inputClassName}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className={`mt-1 text-sm text-red-600 dark:text-red-400 ${errorClassName}`}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${hintClassName}`}>
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 