"use client";

import { Button as AntButton } from 'antd';
import { ReactNode, CSSProperties } from 'react';

export interface CustomButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  shape?: 'default' | 'circle' | 'round';
  icon?: ReactNode;
  danger?: boolean;
  ghost?: boolean;
  className?: string;
  style?: CSSProperties;
  responsive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  htmlType?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'default',
  size = 'middle',
  loading = false,
  disabled = false,
  block = false,
  shape = 'default',
  icon,
  danger = false,
  ghost = false,
  className = '',
  style = {},
  responsive = true,
  onClick,
  htmlType = 'button',
}: CustomButtonProps) {
  // Base styles
  const baseStyles: CSSProperties = {
    minWidth: '120px',
    minHeight: '32px',
    padding: '4px 15px',
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

  const buttonClasses = [
    'custom-button',
    responsive ? 'responsive-button' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <style jsx>{`
        .custom-button {
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          user-select: none;
          touch-action: manipulation;
        }

        .responsive-button {
          min-width: 120px;
          min-height: 32px;
          padding: 4px 15px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .responsive-button {
            min-width: 100px !important;
            font-size: 12px !important;
            padding: 2px 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          .responsive-button {
            min-width: 80px !important;
            font-size: 11px !important;
            padding: 1px 6px !important;
          }
        }

        .custom-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .custom-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .custom-button:disabled {
          transform: none;
          box-shadow: none;
        }
      `}</style>
      
      <AntButton
        type={variant}
        size={getResponsiveSize()}
        loading={loading}
        disabled={disabled}
        block={block}
        shape={shape}
        icon={icon}
        danger={danger}
        ghost={ghost}
        className={buttonClasses}
        style={baseStyles}
        onClick={onClick}
        htmlType={htmlType}
      >
        {children}
      </AntButton>
    </>
  );
}

// Export some commonly used button variants for convenience
export const PrimaryButton = (props: Omit<CustomButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<CustomButtonProps, 'variant'>) => (
  <Button variant="default" {...props} />
);

export const DangerButton = (props: Omit<CustomButtonProps, 'variant' | 'danger'>) => (
  <Button variant="primary" danger {...props} />
);

export const TextButton = (props: Omit<CustomButtonProps, 'variant'>) => (
  <Button variant="text" {...props} />
);

export const LinkButton = (props: Omit<CustomButtonProps, 'variant'>) => (
  <Button variant="link" {...props} />
);
