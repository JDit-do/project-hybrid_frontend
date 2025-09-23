'use client';

import React, { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className,
  size = 'md' 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'modal--sm',
    md: 'modal--md',
    lg: 'modal--lg',
    xl: 'modal--xl',
    full: 'modal--full'
  };

  return (
    <div className="modal">
      {/* Backdrop */}
      <div 
        className="modal__backdrop"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        'modal__content',
        sizeClasses[size],
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
