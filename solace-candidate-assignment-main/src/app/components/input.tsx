"use client";

import { Input as AntInput } from 'antd';
import { ReactNode, CSSProperties } from 'react';
import { SearchOutlined, UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export interface CustomInputProps {
  value?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'search' | 'number' | 'tel' | 'url';
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'filled' | 'borderless' | 'login' | 'search';
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showCount?: boolean;
  maxLength?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  className?: string;
  style?: CSSProperties;
  responsive?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  pattern?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  placeholder,
  type = 'text',
  size = 'middle',
  variant = 'default',
  disabled = false,
  readOnly = false,
  loading = false,
  allowClear = false,
  showCount = false,
  maxLength,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  className = '',
  style = {},
  responsive = true,
  autoComplete,
  autoFocus = false,
  id,
  name,
  required = false,
  pattern,
  min,
  max,
  step,
  onChange,
  onPressEnter,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
}: CustomInputProps) {
  // Base styles
  const baseStyles: CSSProperties = {
    minHeight: '32px',
    fontSize: '14px',
    ...style
  };

  // Responsive size mapping for mobile
  const getResponsiveSize = () => {
    if (!responsive) return size;
    
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 480) {
        return size === 'large' ? 'middle' : size === 'middle' ? 'small' : 'small';
      }
      if (width <= 768) {
        return size === 'large' ? 'middle' : size;
      }
    }
    return size;
  };

  // Get default icons and props based on variant
  const getVariantProps = () => {
    switch (variant) {
      case 'login':
        return {
          prefix: prefix || (type === 'password' ? <LockOutlined /> : <UserOutlined />),
          allowClear: allowClear || true,
          placeholder: placeholder || (type === 'password' ? 'Enter password' : 'Enter username'),
          autoComplete: autoComplete || (type === 'password' ? 'current-password' : 'username'),
        };
      case 'search':
        return {
          prefix: prefix || <SearchOutlined />,
          allowClear: allowClear || true,
          placeholder: placeholder || 'Search...',
          suffix: suffix,
        };
      case 'filled':
        return {
          variant: 'filled' as const,
          prefix: prefix,
          suffix: suffix,
        };
      case 'borderless':
        return {
          variant: 'borderless' as const,
          prefix: prefix,
          suffix: suffix,
        };
      default:
        return {
          prefix: prefix,
          suffix: suffix,
        };
    }
  };

  const variantProps = getVariantProps();

  // Common input classes
  const inputClasses = [
    'custom-input',
    responsive ? 'responsive-input' : '',
    `input-variant-${variant}`,
    loading ? 'input-loading' : '',
    className
  ].filter(Boolean).join(' ');

  // Common input props
  const commonProps = {
    value,
    placeholder: variantProps.placeholder || placeholder,
    size: getResponsiveSize(),
    disabled: disabled || loading,
    readOnly,
    allowClear: variantProps.allowClear || allowClear,
    showCount,
    maxLength,
    prefix: variantProps.prefix,
    suffix: variantProps.suffix,
    addonBefore,
    addonAfter,
    className: inputClasses,
    style: baseStyles,
    autoComplete: variantProps.autoComplete || autoComplete,
    autoFocus,
    id,
    name,
    required,
    pattern,
    min,
    max,
    step,
    onChange,
    onPressEnter,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
  };

  // Render password input with visibility toggle
  if (type === 'password') {
    return (
      <>
        <style jsx>{`
          .custom-input {
            transition: all 0.3s ease;
            width: 100%;
          }

          .responsive-input {
            min-height: 32px;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .responsive-input {
              min-height: 30px !important;
              font-size: 13px !important;
            }
          }
          
          @media (max-width: 480px) {
            .responsive-input {
              min-height: 28px !important;
              font-size: 12px !important;
            }
          }

          .input-variant-login {
            border-radius: 6px;
          }

          .input-variant-search {
            border-radius: 20px;
          }

          .input-loading {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .custom-input:hover:not(.input-loading) {
            border-color: #40a9ff;
          }

          .custom-input:focus:not(.input-loading) {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }

          .ant-input-affix-wrapper {
            transition: all 0.3s ease;
          }

          .ant-input-affix-wrapper:hover {
            border-color: #40a9ff;
          }

          .ant-input-affix-wrapper-focused {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        `}</style>
        
        <AntInput.Password
          {...commonProps}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </>
    );
  }

  // Render search input
  if (type === 'search' || variant === 'search') {
    return (
      <>
        <style jsx>{`
          .custom-input {
            transition: all 0.3s ease;
            width: 100%;
          }

          .responsive-input {
            min-height: 32px;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .responsive-input {
              min-height: 30px !important;
              font-size: 13px !important;
            }
          }
          
          @media (max-width: 480px) {
            .responsive-input {
              min-height: 28px !important;
              font-size: 12px !important;
            }
          }

          .input-variant-search {
            border-radius: 20px;
          }

          .input-loading {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .custom-input:hover:not(.input-loading) {
            border-color: #40a9ff;
          }

          .custom-input:focus:not(.input-loading) {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }

          .ant-input-affix-wrapper {
            transition: all 0.3s ease;
          }

          .ant-input-affix-wrapper:hover {
            border-color: #40a9ff;
          }

          .ant-input-affix-wrapper-focused {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        `}</style>
        
        <AntInput.Search
          {...commonProps}
          loading={loading}
          enterButton={false}
        />
      </>
    );
  }

  // Render regular input
  return (
    <>
      <style jsx>{`
        .custom-input {
          transition: all 0.3s ease;
          width: 100%;
        }

        .responsive-input {
          min-height: 32px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .responsive-input {
            min-height: 30px !important;
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          .responsive-input {
            min-height: 28px !important;
            font-size: 12px !important;
          }
        }

        .input-variant-login {
          border-radius: 6px;
        }

        .input-variant-search {
          border-radius: 20px;
        }

        .input-loading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .custom-input:hover:not(.input-loading) {
          border-color: #40a9ff;
        }

        .custom-input:focus:not(.input-loading) {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .ant-input-affix-wrapper {
          transition: all 0.3s ease;
        }

        .ant-input-affix-wrapper:hover {
          border-color: #40a9ff;
        }

        .ant-input-affix-wrapper-focused {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      `}</style>
      
      <AntInput
        {...commonProps}
        type={type}
        variant={variantProps.variant}
      />
    </>
  );
}

// Export some commonly used input variants for convenience
export const LoginInput = (props: Omit<CustomInputProps, 'variant'>) => (
  <Input variant="login" {...props} />
);

export const SearchInput = (props: Omit<CustomInputProps, 'variant'>) => (
  <Input variant="search" {...props} />
);

export const PasswordInput = (props: Omit<CustomInputProps, 'type'>) => (
  <Input type="password" {...props} />
);

export const EmailInput = (props: Omit<CustomInputProps, 'type'>) => (
  <Input type="email" {...props} />
);

export const NumberInput = (props: Omit<CustomInputProps, 'type'>) => (
  <Input type="number" {...props} />
);
